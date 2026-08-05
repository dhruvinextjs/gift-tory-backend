const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/deliveryCharge.controller");

router.get("/", controller.getAllDeliveryCharges);

router.post("/", controller.createDeliveryChargeApi);

router.put("/:id", controller.updateDeliveryChargeApi);

router.delete("/:id", controller.deleteDeliveryChargeApi);

module.exports = router;