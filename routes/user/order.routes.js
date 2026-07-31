const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/user/order.controller");
const { protectUser } = require("../../middlewares/auth.middleware");

router.use(protectUser); // all order routes require login

router.post("/", orderController.placeOrder);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;
