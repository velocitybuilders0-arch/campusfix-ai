/**
 * Public CampusFix AI entry point.
 *
 * @example
 * const result = await analyzeIssue({ title: "Broken fan", description: "Fan is not working." });
 */
import { analyzeWithFallback } from "./providers/fallback.js";
import { analyzeWithGemini } from "./providers/gemini.js";
import { validateIssueInput } from "./validate/input.js";
import { validateAIResult } from "./validate/output.js";

export async function analyzeIssue(input) {
  const normalized = validateIssueInput(input);
  let result;

  try {
    result = await analyzeWithGemini(normalized);
  } catch (error) {
    console.warn(`${error.name ?? "Error"}: ${error.message ?? "Unknown provider error"}`);
    result = analyzeWithFallback(normalized);
  }

  return {
    ...validateAIResult(result),
    source: result.source,
  };
}

export {
  InputValidationError,
  OutputValidationError,
  ProviderError,
  ProviderUnavailableError,
} from "./errors.js";
export {
  ALLOWED_CATEGORIES,
  ALLOWED_PRIORITIES,
  DEPARTMENTS,
} from "./constants.js";
