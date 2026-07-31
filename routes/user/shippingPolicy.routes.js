const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/shippingPolicy.controller");

router.get(
    "/",
    controller.getShippingPolicy
);

module.exports = router;