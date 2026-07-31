const Category = require("../../models/category.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all active categories
// @route   GET /api/user/categories
exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("displayOrder");
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// @desc    Get single category by slug
// @route   GET /api/user/categories/:slug
exports.getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw new ApiError(404, "Category not found");
  res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});
