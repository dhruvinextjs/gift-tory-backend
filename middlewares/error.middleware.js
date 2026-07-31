const ApiError = require("../utils/ApiError");

// 404 handler for unmatched API routes
const notFound = (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: `Route not found - ${req.originalUrl}`,
    });
  }
  next();
};

// Central error handler
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    error = new ApiError(400, `Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(", "));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please login again.");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Session expired. Please login again.");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // If request is for the Admin panel (EJS), redirect with flash instead of JSON
  if (req.originalUrl.startsWith("/admin") && !req.originalUrl.startsWith("/admin/api")) {
    if (req.flash) req.flash("error", message);
    console.error("ADMIN PANEL ERROR:", err);
    return res.redirect("back");
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
  });
};

module.exports = { notFound, errorHandler };
