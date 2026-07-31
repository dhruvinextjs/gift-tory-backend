const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const Admin = require("../models/admin.model");

// ---- For Admin PANEL (EJS views) - session based ----
exports.requireAdminSession = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.flash("error", "Please login to access the admin panel");
  return res.redirect("/admin/login");
};

// Redirect to dashboard if already logged in (used on login page)
exports.redirectIfAdminLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin/dashboard");
  }
  next();
};

// ---- For Admin REST APIs - JWT based ----
exports.protectAdmin = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.adminToken) {
    token = req.cookies.adminToken;
  }

  if (!token) {
    throw new ApiError(401, "Admin authentication required.");
  }

  const decoded = jwt.verify(token, process.JWT_USER_SECRET);
  if (decoded.role !== "admin") {
    throw new ApiError(403, "Not authorized as admin.");
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    throw new ApiError(401, "Admin no longer exists.");
  }

  req.admin = admin;
  next();
});
