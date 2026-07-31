const Banner = require("../../models/banner.model");
const Category = require("../../models/category.model");
const Occasion = require("../../models/occasion.model");
const Product = require("../../models/product.model");
const Testimonial = require("../../models/testimonial.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all data required to render the homepage in a single call
// @route   GET /api/user/home
exports.getHomeData = catchAsync(async (req, res) => {
  const [heroBanners, dealBanner, categories, occasions, bestSellers, featured, testimonials] =
    await Promise.all([
      Banner.find({ position: "hero", isActive: true }).sort("displayOrder"),
      Banner.findOne({ position: "deal", isActive: true }),
      Category.find({ isActive: true }).sort("displayOrder").limit(9),
      Occasion.find({ isActive: true }).sort("displayOrder").limit(4),
      Product.find({ isActive: true, isBestSeller: true }).limit(5),
      Product.find({ isActive: true, isFeatured: true }).limit(5),
      Testimonial.find({ isActive: true }).sort("displayOrder").limit(6),
    ]);

  res.status(200).json(
    new ApiResponse(
      200,
      { heroBanners, dealBanner, categories, occasions, bestSellers, featured, testimonials },
      "Homepage data fetched successfully"
    )
  );
});
