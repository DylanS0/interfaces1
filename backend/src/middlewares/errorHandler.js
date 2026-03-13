function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({
      success: false,
      message,
      details: err.details || null
    });
  }

  return res.status(status).json({
    success: false,
    message: status >= 500 ? 'Internal server error' : message
  });
}

module.exports = { errorHandler };
