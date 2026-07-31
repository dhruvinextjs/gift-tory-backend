const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/homeInfo.controller");

router.get("/", controller.getHomeInfo);

router.post("/", controller.saveHomeInfo);

module.exports = router;