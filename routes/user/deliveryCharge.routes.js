const express = require("express");
const router = express.Router();

const deliveryChargeController = require("../../controllers/user/deliveryCharge.controller");

router.get(
  "/",
  deliveryChargeController.getDeliveryCharges
);

module.exports = router;