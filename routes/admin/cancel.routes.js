const express = require("express");
const router = express.Router();

const cancelController = require("../../controllers/admin/cancel.controller");

router.get("/", cancelController.getAllCancelRequests);

module.exports = router;