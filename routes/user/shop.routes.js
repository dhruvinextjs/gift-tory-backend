const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/shop.controller");

router.get(
    "/",
    controller.getShops
);

module.exports = router;