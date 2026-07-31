const Newsletter = require("../../models/newsletter.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Subscribe to newsletter
// @route   POST /api/user/newsletter
exports.subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const existing = await Newsletter.findOne({ email });
  if (existing) throw new ApiError(400, "This email is already subscribed");

  const sub = await Newsletter.create({ email });
  res.status(201).json(new ApiResponse(201, sub, "Subscribed successfully"));
});
