const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/banner.controller");

router.get(
    "/",
    controller.getBanners
);

module.exports = router;