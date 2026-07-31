const express = require("express");
const router = express.Router();

const returnController = require("../../controllers/admin/return.controller");

router.get(
    "/",
    returnController.renderReturnRequests
);

router.get(
    "/api",
    returnController.getAllReturnRequests
);

module.exports = router;