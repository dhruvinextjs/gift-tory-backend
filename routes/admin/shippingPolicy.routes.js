const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/shippingPolicy.controller");

router.get(
    "/",
    controller.getShippingPolicy
);

router.post(
    "/",
    controller.saveShippingPolicy
);

module.exports = router;