// Wraps async controller functions so we don't need try/catch everywhere.
// Any rejected promise / thrown error is forwarded to Express's error middleware.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
