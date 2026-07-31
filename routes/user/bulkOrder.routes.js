const express = require("express");
const router = express.Router();
const bulkOrderController = require("../../controllers/user/bulkOrder.controller");

router.post("/", bulkOrderController.submitBulkOrder);

module.exports = router;
