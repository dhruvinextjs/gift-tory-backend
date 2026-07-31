const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/coupon.controller");

router.get(
    "/",
    controller.getCoupons
);

module.exports = router;