const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/about.controller");

router.get(
    "/",
    controller.getAboutPage
);

module.exports = router;