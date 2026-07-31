const express = require("express");
const router = express.Router();
const couponController = require("../../controllers/admin/coupon.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", couponController.getAllCouponsApi);
router.post("/", couponController.createCouponApi);
router.put("/:id", couponController.updateCouponApi);
router.delete("/:id", couponController.deleteCouponApi);

module.exports = router;
