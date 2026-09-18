// Consistent API error class. Every error thrown with `expose: true`
// will surface its message to the client; everything else becomes a
// generic 500 with "Internal server error".
//
// Matches the error shape already used by backend/middleware/errorHandler.js:
//   { success: false, error: { message } }

class ApiError extends Error {
  constructor(status, message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.expose = options.expose !== false;
    if (options.details !== undefined) this.details = options.details;
  }
}

const badRequest = (message = 'Invalid request', details) =>
  new ApiError(400, message, { details });

const unauthorized = (message = 'Authentication required') =>
  new ApiError(401, message);

const forbidden = (message = 'You are not allowed to perform this action') =>
  new ApiError(403, message);

const notFound = (message = 'Resource not found') =>
  new ApiError(404, message);

const conflict = (message = 'Conflict') =>
  new ApiError(409, message);

const serviceUnavailable = (message = 'Service unavailable') =>
  new ApiError(503, message);

const internal = (message = 'Internal server error') =>
  new ApiError(500, message, { expose: false });

module.exports = {
  ApiError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serviceUnavailable,
  internal
};
