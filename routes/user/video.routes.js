const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/video.controller");

router.get(
    "/",
    controller.getVideos
);

module.exports = router;