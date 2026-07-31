const express = require("express");
const router = express.Router();
const bulkOrderController = require("../../controllers/admin/bulkOrder.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", bulkOrderController.getAllBulkOrdersApi);
router.put("/:id/status", bulkOrderController.updateBulkOrderStatusApi);
router.delete("/:id", bulkOrderController.deleteBulkOrderApi);

module.exports = router;
