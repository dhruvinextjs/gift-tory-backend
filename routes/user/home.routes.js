const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/user/home.controller");

router.get("/", homeController.getHomeData);

module.exports = router;
