const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

// Protect User API routes - expects Bearer token OR "token" cookie
exports.protectUser = catchAsync(async (req, res, next) => {

  console.log("Authorization Header:", req.headers.authorization);

  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  console.log("Extracted Token:", token);
  console.log("JWT_USER_SECRET:", process.env.JWT_USER_SECRET);

  if (!token) {
    throw new ApiError(401, "You are not logged in. Please login to continue.");
  }

  const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

  console.log("Decoded:", decoded);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new ApiError(401, "The user belonging to this token no longer exists.");
  }

  req.user = currentUser;
  next();
});

// Attach user if token present, but do not block the request if absent
exports.optionalUser = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) req.user = currentUser;
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
});
