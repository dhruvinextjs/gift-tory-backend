const Review = require("../../models/review.model");
const Product = require("../../models/product.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating.toFixed(1),
      ratingsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 4.5,
      ratingsCount: 0,
    });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/user/reviews/:productId
// @desc Get all reviews of a product
// @route GET /api/user/reviews/:productId

exports.getProductReviews = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviews = await Review.find({
    product: req.params.productId,

    isApproved: true,
  })

    .populate("user", "name email profileImage")

    .sort("-createdAt");

  res.status(200).json(
    new ApiResponse(
      200,

      {
        averageRating: product.ratingsAverage,

        totalReviews: product.ratingsCount,

        reviews,
      },

      "Reviews fetched successfully",
    ),
  );
});

// @desc    Add a review for a product
// @route   POST /api/user/reviews/:productId
exports.addReview = catchAsync(async (req, res) => {
  const { rating, comment, reviewerName, reviewerEmail } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, "Product not found");

  let existing = null;

  if (req.user) {
    existing = await Review.findOne({
      product: req.params.productId,
      user: req.user._id,
    });

    if (existing) {
      throw new ApiError(400, "You have already reviewed this product");
    }
  }
  if (existing)
    throw new ApiError(400, "You have already reviewed this product");

  const review = await Review.create({
    product: req.params.productId,

    user: req.user ? req.user._id : null,

    reviewerName: req.user?.name || reviewerName || "Guest",

    reviewerEmail: req.user?.email || reviewerEmail || "",

    rating,

    comment,
  });

  await recalculateProductRating(req.params.productId);

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});

// @desc    Update own review
// @route   PUT /api/user/reviews/:reviewId
exports.updateReview = catchAsync(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.reviewId,
    user: req.user._id,
  });
  if (!review) throw new ApiError(404, "Review not found");

  const { rating, comment } = req.body;
  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  await review.save();

  await recalculateProductRating(review.product);

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

// @desc    Delete own review
// @route   DELETE /api/user/reviews/:reviewId
exports.deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.reviewId,
    user: req.user._id,
  });
  if (!review) throw new ApiError(404, "Review not found");

  await recalculateProductRating(review.product);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});
