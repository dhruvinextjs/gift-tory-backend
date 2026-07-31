const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/video.controller");

const upload = require("../../middlewares/multer.middleware");

router.get(
    "/",
    controller.getVideos
);

router.post(
    "/",
    upload("videos").fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    controller.createVideo
);

router.post(
    "/delete/:id",
    controller.deleteVideo
);

module.exports = router;