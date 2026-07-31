const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/admin/review.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", reviewController.getAllReviewsApi);
router.put("/:id/toggle-approve", reviewController.toggleApproveReviewApi);
router.delete("/:id", reviewController.deleteReviewApi);

module.exports = router;
