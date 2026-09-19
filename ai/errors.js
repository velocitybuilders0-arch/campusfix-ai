/** Error thrown when submitted issue input is invalid. */
export class InputValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "InputValidationError";
    this.details = details ?? null;
  }
}

/** Error thrown when an AI provider returns a malformed result. */
export class OutputValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "OutputValidationError";
    this.details = details ?? null;
  }
}

/** Error thrown when the Gemini provider fails during a request. */
export class ProviderError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ProviderError";
    this.cause = cause ?? null;
  }
}

/** Error thrown when a provider cannot be attempted. */
export class ProviderUnavailableError extends ProviderError {
  constructor(message, cause) {
    super(message, cause);
    this.name = "ProviderUnavailableError";
  }
}
