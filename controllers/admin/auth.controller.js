const Admin = require("../../models/admin.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const generateToken = require("../../utils/generateToken");

// ============================
//   ADMIN PANEL (EJS + Session)
// ============================

// @desc    Render login page
// @route   GET /admin/login
exports.renderLoginPage = (req, res) => {
  res.render("admin/login", {
    title: "Admin Login",
    layout: false,
    error: req.flash("error"),
  });
};

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

  res.redirect("/admin/dashboard");
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
