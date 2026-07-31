const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/order.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", orderController.getAllOrdersApi);
router.get("/:id", orderController.getOrderByIdApi);
router.put("/:id/status", orderController.updateOrderStatusApi);

module.exports = router;
