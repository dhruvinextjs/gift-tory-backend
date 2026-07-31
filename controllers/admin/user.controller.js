const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// ============ ADMIN PANEL ============

// @desc    List all users (panel)
// @route   GET /admin/users
exports.renderUserList = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";

  const filter = search
    ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
    : {};

  const users = await User.find(filter)
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.render("admin/users/list", {
    title: "Users",
    active: "users",
    users,
    search,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Toggle block/unblock a user (panel)
// @route   POST /admin/users/:id/toggle-block
exports.toggleBlockUserPanel = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/admin/users");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();

  req.flash("success", `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`);
  res.redirect("/admin/users");
});

// ============ ADMIN API ============

// @desc    Get all users (API)
// @route   GET /api/admin/users
exports.getAllUsersApi = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const users = await User.find()
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments();

  res.status(200).json(
    new ApiResponse(
      200,
      { users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
      "Users fetched successfully"
    )
  );
});

// @desc    Get single user (API)
// @route   GET /api/admin/users/:id
exports.getUserByIdApi = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// @desc    Block / unblock a user (API)
// @route   PUT /api/admin/users/:id/toggle-block
exports.toggleBlockUserApi = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, user, `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`)
  );
});

// @desc    Delete a user (API)
// @route   DELETE /api/admin/users/:id
exports.deleteUserApi = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});
