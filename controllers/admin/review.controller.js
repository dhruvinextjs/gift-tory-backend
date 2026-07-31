const Review = require("../../models/review.model");
const Product = require("../../models/product.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating.toFixed(1),
      ratingsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratingsAverage: 4.5, ratingsCount: 0 });
  }
};

// ============ ADMIN PANEL ============

// @desc    List all reviews (panel)
// @route   GET /admin/reviews
exports.renderReviewList = catchAsync(async (req, res) => {
  const reviews = await Review.find()
    .populate("product", "name")
    .populate("user", "name email")
    .sort("-createdAt");
  res.render("admin/reviews/list", { title: "Reviews", active: "reviews", reviews });
});

// @desc    Toggle approve/hide review (panel)
// @route   POST /admin/reviews/:id/toggle-approve
exports.toggleApproveReviewPanel = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect("/admin/reviews");
  }
  review.isApproved = !review.isApproved;
  await review.save();
  await recalculateProductRating(review.product);

  req.flash("success", "Review status updated");
  res.redirect("/admin/reviews");
});

// @desc    Delete review (panel)
// @route   POST /admin/reviews/:id/delete
exports.deleteReviewPanel = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (review) await recalculateProductRating(review.product);
  req.flash("success", "Review deleted successfully");
  res.redirect("/admin/reviews");
});

// ============ ADMIN API ============

exports.getAllReviewsApi = catchAsync(async (req, res) => {
  const reviews = await Review.find().populate("product", "name").populate("user", "name email").sort("-createdAt");
  res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

exports.toggleApproveReviewApi = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  review.isApproved = !review.isApproved;
  await review.save();
  await recalculateProductRating(review.product);

  res.status(200).json(new ApiResponse(200, review, "Review status updated"));
});

exports.deleteReviewApi = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  await recalculateProductRating(review.product);
  res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});
