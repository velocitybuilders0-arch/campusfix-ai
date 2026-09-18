// Isolated adapter around Garv's ESM `ai/` module.
//
// Contract (per approved architecture):
//   input:  { title, description }
//   output: { category, priority, summary, department }
//
// The `ai/` module is ESM and lives at `<repo>/ai/index.js`. This backend is
// CommonJS, so we use dynamic `import()` and cache the module once loaded.
//
// If the module is not present in this checkout (it lives on garv-main),
// the adapter throws ApiError(503) with a clear message. It NEVER fabricates
// AI results.

const path = require('path');
const { serviceUnavailable, badRequest } = require('../utils/errors');

const AI_ENTRY = path.resolve(__dirname, '..', '..', 'ai', 'index.js');

let _modPromise = null;

function loadAiModule() {
  if (!_modPromise) {
    _modPromise = import('file://' + AI_ENTRY.replace(/\\/g, '/')).catch((err) => {
      // Reset so a later attempt can retry (e.g. after ai/ is added).
      _modPromise = null;
      if (err && (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'MODULE_NOT_FOUND')) {
        const e = serviceUnavailable('AI service is not available');
        e.cause = err;
        throw e;
      }
      throw err;
    });
  }
  return _modPromise;
}

// Shape the response for the API contract, stripping provider-internal fields.
function toPublicResult(r) {
  if (!r || typeof r !== 'object') {
    throw serviceUnavailable('AI service returned an invalid response');
  }
  const { category, priority, summary, department } = r;
  return { category, priority, summary, department };
}

async function analyzeIssue({ title, description }) {
  let mod;
  try {
    mod = await loadAiModule();
  } catch (err) {
    // Module not present in this checkout.
    if (err.status === 503) throw err;
    throw serviceUnavailable('AI service is not available');
  }

  if (!mod || typeof mod.analyzeIssue !== 'function') {
    throw serviceUnavailable('AI service is not available');
  }

  try {
    const result = await mod.analyzeIssue({ title, description });
    return toPublicResult(result);
  } catch (err) {
    // Map Garv's exported error classes to HTTP-friendly errors.
    const name = err && err.name;
    if (name === 'InputValidationError') {
      throw badRequest(err.message || 'Invalid AI input');
    }
    if (name === 'OutputValidationError') {
      throw serviceUnavailable('AI service returned an invalid response');
    }
    if (name === 'ProviderUnavailableError' || name === 'ProviderError') {
      // The ai/ module itself falls back to deterministic locally; if it
      // still surfaces a provider error, treat as unavailable.
      throw serviceUnavailable('AI service is not available');
    }
    throw err;
  }
}

function isAvailable() {
  const fs = require('fs');
  return fs.existsSync(AI_ENTRY);
}

module.exports = { analyzeIssue, isAvailable };
