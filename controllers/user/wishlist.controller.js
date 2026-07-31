const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/product.model");

// =========================
// Add To Wishlist
// =========================

exports.addToWishlist = async (req, res) => {
  const { productId } = req.params;

  const userId = req.user._id;

  // Check Product Exists
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Already Exists
  const exists = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Product already in wishlist",
    });
  }

  await Wishlist.create({
    user: userId,

    product: productId,
  });

  res.status(201).json({
    success: true,

    message: "Product added to wishlist",
  });
};

// =========================
// Get Wishlist
// =========================

exports.getWishlist = async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.find({
    user: userId,
  }).populate("product");

  res.status(200).json({
    success: true,

    count: wishlist.length,

    data: wishlist,
  });
};

// =========================
// Remove Wishlist
// =========================

exports.removeWishlist = async (req, res) => {
  const { productId } = req.params;

  const userId = req.user._id;

  const item = await Wishlist.findOneAndDelete({
    user: userId,

    product: productId,
  });

  if (!item) {
    return res.status(404).json({
      success: false,

      message: "Wishlist item not found",
    });
  }

  res.status(200).json({
    success: true,

    message: "Removed from wishlist",
  });
};
