const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/user/review.controller");
const { protectUser } = require("../../middlewares/auth.middleware");
const {
    optionalUser
} = require("../../middlewares/auth.middleware");

router.get("/:productId", reviewController.getProductReviews);
router.post(
    "/:productId",
    optionalUser,
    reviewController.addReview
);
router.put("/:reviewId", protectUser, reviewController.updateReview);
router.delete("/:reviewId", protectUser, reviewController.deleteReview);

module.exports = router;
