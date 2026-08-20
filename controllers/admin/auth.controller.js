const Admin = require("../../models/admin.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const generateToken = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");

// ============================
//   ADMIN PANEL (EJS + Session)
// ============================

// @desc    Render login page
// @route   GET /admin/login
exports.renderLoginPage = (req, res) => {
  res.render("login", {
    title: "Admin Login",
    layout: false,
    error: req.flash("error"),
  });
};

exports.renderChangePasswordPage = (req, res) => {
  res.render("admin/change-password", {
    title: "Change Password",
    active: "change-password",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

// @desc    Change admin password from Admin Panel
// @route   POST /admin/change-password
exports.changePasswordPanel = catchAsync(async (req, res) => {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  // Admin login check
  if (!req.session.adminId) {
    return res.redirect("/admin/login");
  }

  // Required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    req.flash("error", "All fields are required");
    return res.redirect("/admin/change-password");
  }

  // Confirm password
  if (newPassword !== confirmPassword) {
    req.flash(
      "error",
      "New password and confirm password do not match"
    );

    return res.redirect("/admin/change-password");
  }

  // Minimum password length
  if (newPassword.length < 8) {
    req.flash(
      "error",
      "New password must be at least 8 characters"
    );

    return res.redirect("/admin/change-password");
  }

  // Find logged-in admin using session
  const admin = await Admin.findById(req.session.adminId)
    .select("+password");

  if (!admin) {
    req.flash("error", "Admin not found");
    return res.redirect("/admin/login");
  }

  // Check current password
  const isPasswordCorrect =
    await admin.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    req.flash(
      "error",
      "Current password is incorrect"
    );

    return res.redirect("/admin/change-password");
  }

  // Check if new password is same as old password
  const isSamePassword =
    await admin.comparePassword(newPassword);

  if (isSamePassword) {
    req.flash(
      "error",
      "New password must be different from current password"
    );

    return res.redirect("/admin/change-password");
  }

  // Update password
  admin.password = newPassword;

  await admin.save();

  req.flash(
    "success",
    "Password changed successfully"
  );

  return res.redirect("/admin/change-password");
});

// @desc    Handle login form submission (session based)
// @route   POST /admin/login
exports.panelLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/admin/login");
  }

  if (!admin.isActive) {
    req.flash("error", "Your admin account has been deactivated");
    return res.redirect("/admin/login");
  }

  req.session.adminId = admin._id;
  req.session.adminName = admin.name;
  req.session.adminRole = admin.role;

  // explicitly save before redirecting
  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("/admin/login");
    }
    res.redirect("/admin/dashboard");
  });
});

// @desc    Logout from panel
// @route   GET /admin/logout
exports.panelLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};

// ============================
//   ADMIN REST API (JWT)
// ============================

// @desc    Admin login via API (returns JWT)
// @route   POST /api/admin/auth/login
exports.apiLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(admin._id, "admin");
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }, token },
      "Admin login successful"
    )
  );
});

// @desc    Get logged in admin profile via API
// @route   GET /api/admin/auth/me
exports.apiGetProfile = catchAsync(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.admin, "Admin profile fetched"));
});


// @desc    Change admin password
// @route   POST /api/admin/auth/change-password
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters");
  }

  const adminId = req.admin._id;

  const admin = await Admin.findById(adminId).select("+password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordCorrect = await admin.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const isSamePassword = await admin.comparePassword(newPassword);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from current password"
    );
  }

  admin.password = newPassword;

  await admin.save();

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Password changed successfully"
    )
  );
});