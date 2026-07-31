const Occasion = require("../../models/occasion.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all active occasions
// @route   GET /api/user/occasions
exports.getAllOccasions = catchAsync(async (req, res) => {
  const occasions = await Occasion.find({ isActive: true }).sort("displayOrder");
  res.status(200).json(new ApiResponse(200, occasions, "Occasions fetched successfully"));
});

// @desc    Get single occasion by slug
// @route   GET /api/user/occasions/:slug
exports.getOccasionBySlug = catchAsync(async (req, res) => {
  const occasion = await Occasion.findOne({ slug: req.params.slug, isActive: true });
  if (!occasion) throw new ApiError(404, "Occasion not found");
  res.status(200).json(new ApiResponse(200, occasion, "Occasion fetched successfully"));
});
