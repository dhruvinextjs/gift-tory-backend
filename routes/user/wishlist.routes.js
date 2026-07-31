const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/wishlist.controller");

const { protectUser } = require("../../middlewares/auth.middleware");


// Add To Wishlist
router.post(
    "/:productId",
    protectUser,
    controller.addToWishlist
);


// Get Wishlist
router.get(
    "/",
    protectUser,
    controller.getWishlist
);


// Remove Wishlist
router.delete(
    "/:productId",
    protectUser,
    controller.removeWishlist
);

module.exports = router;