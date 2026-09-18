// Supabase client factory.
//
// - admin:   uses the service-role key, bypasses RLS. Server-side only.
//            Never expose this key or this client to the frontend.
// - public:  uses the anon key, used only to verify user JWTs.
//
// Both clients are constructed lazily and cached. If required env vars are
// missing, `getAdminClient()` / `getPublicClient()` throw ApiError(503) with
// a clear message, so endpoints that need the DB fail loudly instead of
// silently returning fake data.

const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');
const { serviceUnavailable } = require('../utils/errors');

let _admin = null;
let _public = null;

function assertAdminConfig() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw serviceUnavailable(
      'Database is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)'
    );
  }
}

function assertPublicConfig() {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw serviceUnavailable(
      'Auth is not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)'
    );
  }
}

function getAdminClient() {
  assertAdminConfig();
  if (!_admin) {
    _admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return _admin;
}

function getPublicClient() {
  assertPublicConfig();
  if (!_public) {
    _public = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return _public;
}

function isDatabaseConfigured() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function isAuthConfigured() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

module.exports = {
  getAdminClient,
  getPublicClient,
  isDatabaseConfigured,
  isAuthConfigured
};
