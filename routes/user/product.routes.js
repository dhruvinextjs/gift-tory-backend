const express = require("express");
const router = express.Router();
const productController = require("../../controllers/user/product.controller");
const { protectUser } = require("../../middlewares/auth.middleware");

router.get("/wishlist/me", protectUser, productController.getWishlist);
router.get("/", productController.getAllProducts);
router.get("/:slug", productController.getProductBySlug);
router.get("/:slug/related", productController.getRelatedProducts);
router.post("/:id/wishlist", protectUser, productController.toggleWishlist);

module.exports = router;
