const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/homeInfo.controller");

router.get(
    "/",
    controller.getHomeInfo
);

module.exports = router;