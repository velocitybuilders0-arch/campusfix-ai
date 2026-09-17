// Central error handler. Never leaks stack traces or internal details.
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  if (status >= 500) {
    console.error('[error]', err.message);
  }

  res.status(status).json({
    success: false,
    error: { message }
  });
}

module.exports = errorHandler;
