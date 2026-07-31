const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const ApiFeatures = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all products (search, filter, sort, paginate)
// @route   GET /api/user/products
// Query params supported:
//   search, category, occasion, minPrice, maxPrice, sort, page, limit,
//   isTrending, isFeatured, isBestSeller, isNewArrival, isPersonalized, isCorporateGift
exports.getAllProducts = catchAsync(async (req, res) => {
  const filters = { isActive: true };
  const q = req.query;

  if (q.category) filters.category = q.category;
  if (q.occasion) filters.occasion = q.occasion;
  if (q.isTrending) filters.isTrending = q.isTrending === "true";
  if (q.isFeatured) filters.isFeatured = q.isFeatured === "true";
  if (q.isBestSeller) filters.isBestSeller = q.isBestSeller === "true";
  if (q.isNewArrival) filters.isNewArrival = q.isNewArrival === "true";
  if (q.isPersonalized) filters.isPersonalized = q.isPersonalized === "true";
  if (q.isCorporateGift) filters.isCorporateGift = q.isCorporateGift === "true";
  if (q.isSameDayDelivery) filters.isSameDayDelivery = q.isSameDayDelivery === "true";

  if (q.minPrice || q.maxPrice) {
    filters.discountPrice = {};
    if (q.minPrice) filters.discountPrice.$gte = Number(q.minPrice);
    if (q.maxPrice) filters.discountPrice.$lte = Number(q.maxPrice);
  }

  let baseQuery = Product.find(filters).populate("category", "name slug").populate("occasion", "name slug");

  const features = new ApiFeatures(baseQuery, q)
    .search(["name", "description", "tags"])
    .sort()
    .paginate();

  const products = await features.query;
  const total = await Product.countDocuments(filters);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: features.page,
          limit: features.limit,
          totalPages: Math.ceil(total / features.limit),
        },
      },
      "Products fetched successfully"
    )
  );
});

// @desc    Get single product by slug
// @route   GET /api/user/products/:slug
exports.getProductBySlug = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("occasion", "name slug");

  if (!product) throw new ApiError(404, "Product not found");

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// @desc    Get related products (same category)
// @route   GET /api/user/products/:slug/related
exports.getRelatedProducts = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, "Product not found");

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(8);

  res.status(200).json(new ApiResponse(200, related, "Related products fetched"));
});

// @desc    Toggle wishlist (add/remove)
// @route   POST /api/user/products/:id/wishlist
exports.toggleWishlist = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const user = await User.findById(req.user._id);
  const index = user.wishlist.findIndex((p) => p.toString() === req.params.id);

  let message;
  if (index > -1) {
    user.wishlist.splice(index, 1);
    message = "Removed from wishlist";
  } else {
    user.wishlist.push(req.params.id);
    message = "Added to wishlist";
  }
  await user.save();

  res.status(200).json(new ApiResponse(200, user.wishlist, message));
});

// @desc    Get logged-in user's wishlist
// @route   GET /api/user/products/wishlist/me
exports.getWishlist = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json(new ApiResponse(200, user.wishlist, "Wishlist fetched"));
});
