import {
  ALLOWED_CATEGORIES,
  ALLOWED_PRIORITIES,
  INPUT_LIMITS,
} from "../constants.js";
import { OutputValidationError } from "../errors.js";

/**
 * Validate and normalize a provider result.
 * @param {unknown} result
 * @returns {{ category: string, priority: string, summary: string, department: string }}
 * @throws {OutputValidationError}
 */
export function validateAIResult(result) {
  if (result === null || typeof result !== "object") {
    throw new OutputValidationError("AI result must be an object");
  }

  if (!ALLOWED_CATEGORIES.includes(result.category)) {
    throw new OutputValidationError("Category is not allowed", {
      field: "category",
      received: result.category,
    });
  }

  if (!ALLOWED_PRIORITIES.includes(result.priority)) {
    throw new OutputValidationError("Priority is not allowed", {
      field: "priority",
      received: result.priority,
    });
  }

  const summary = typeof result.summary === "string" ? result.summary.trim() : "";
  if (!summary || summary.length > INPUT_LIMITS.summaryMax) {
    throw new OutputValidationError("Summary must be a non-empty string within the limit", {
      field: "summary",
    });
  }

  const department = typeof result.department === "string" ? result.department.trim() : "";
  if (!department) {
    throw new OutputValidationError("Department must be a non-empty string", {
      field: "department",
    });
  }

  return {
    category: result.category,
    priority: result.priority,
    summary,
    department,
  };
}
