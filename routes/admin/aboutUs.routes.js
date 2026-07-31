const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/multer.middleware");

const controller = require("../../controllers/admin/aboutUs.controller");

router.get(
    "/",
    controller.getAboutUs
);

router.post(
    "/",
    upload("about-us").fields([
        {
            name: "brandImage",
            maxCount: 1
        },
        {
            name: "studioImage1",
            maxCount: 1
        },
        {
            name: "studioImage2",
            maxCount: 1
        },
        {
            name: "studioImage3",
            maxCount: 1
        },
        {
            name: "journeyIcon0",
            maxCount: 1
        },
        {
            name: "journeyIcon1",
            maxCount: 1
        },
        {
            name: "journeyIcon2",
            maxCount: 1
        },
        {
            name: "journeyIcon3",
            maxCount: 1
        }
    ]),
    controller.saveAboutUs
);

module.exports = router;