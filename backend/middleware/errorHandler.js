// Central error handler.
// - Never leaks stack traces or internal details.
// - Preserves the existing response shape: { success:false, error:{ message } }.

function errorHandler(err, req, res, next) {
  // Body-parser JSON syntax error → 400
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid JSON in request body' }
    });
  }

  // Explicit ApiError from utils/errors.js
  if (err && err.name === 'ApiError') {
    const status = err.status || 500;
    const message = err.expose === false ? 'Internal server error' : err.message;
    if (status >= 500) console.error('[error]', err.message);
    return res.status(status).json({ success: false, error: { message } });
  }

  // Supabase PostgREST errors tend to have .code and .message.
  // Surface them as 500 with a generic message (do not leak DB details).
  const status = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  if (status >= 500) {
    console.error('[error]', err && err.message ? err.message : err);
  }

  return res.status(status).json({
    success: false,
    error: { message }
  });
}

module.exports = errorHandler;
