const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/cart.controller");
const { optionalUser } = require("../../middlewares/auth.middleware");

router.use(optionalUser);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.post(
    "/apply-coupon",
    optionalUser,
    cartController.applyCoupon
);

router.delete(
    "/remove-coupon",
    optionalUser,
    cartController.removeCoupon
);
router.get(
    "/summary",
    optionalUser,
    cartController.getCartSummary
);
router.put("/:itemId", cartController.updateCartItem);
router.delete("/:itemId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

module.exports = router;
