const Testimonial = require("../../models/testimonial.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all active testimonials
// @route   GET /api/user/testimonials
exports.getAllTestimonials = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort("displayOrder");
  res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});
