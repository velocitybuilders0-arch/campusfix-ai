import { INPUT_LIMITS } from "../constants.js";
import { InputValidationError } from "../errors.js";

/**
 * Validate and normalize a submitted campus issue.
 * @param {unknown} input
 * @returns {{ title: string, description: string, image: string | null }}
 * @throws {InputValidationError}
 */
export function validateIssueInput(input) {
  if (input === null || typeof input !== "object") {
    throw new InputValidationError("Input must be an object");
  }

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (title.length < INPUT_LIMITS.titleMin || title.length > INPUT_LIMITS.titleMax) {
    throw new InputValidationError("Title must be a string with a valid length", { field: "title" });
  }

  const description = typeof input.description === "string" ? input.description.trim() : "";
  if (
    description.length < INPUT_LIMITS.descriptionMin ||
    description.length > INPUT_LIMITS.descriptionMax
  ) {
    throw new InputValidationError(
      "Description must be a string with a valid length",
      { field: "description" },
    );
  }

  if (input.image !== undefined && input.image !== null && typeof input.image !== "string") {
    throw new InputValidationError("Image must be a string or null", { field: "image" });
  }

  return {
    title,
    description,
    image: input.image ?? null,
  };
}
