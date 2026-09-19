import { OutputValidationError } from "./errors.js";

/**
 * Parse a provider response that should contain a JSON object.
 * @param {unknown} rawText
 * @returns {object}
 * @throws {OutputValidationError}
 */
export function parseProviderResponse(rawText) {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new OutputValidationError("Provider returned empty response");
  }

  const text = rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // Fall through to the consistent provider response error below.
      }
    }
  }

  throw new OutputValidationError("Provider response is not valid JSON", { rawText });
}
