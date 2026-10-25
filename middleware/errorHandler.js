function notFound(req, _res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
}
function errorHandler(err, _req, res, _next) {
  const status = err.status || (err.name === 'ValidationError' ? 422 :
    err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500);
  const message = status === 500 ? (err.expose ? err.message : 'Internal server error') : err.message;
  res.status(status).json({ error: { status, message, ...(err.codeName ? { code: err.codeName } : {}) } });
}
module.exports = { notFound, errorHandler };
