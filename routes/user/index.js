const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/auth.controller");

router.post("/auth/request-otp", authController.requestOtp);
router.post("/auth/verify-otp", authController.verifyOtp);
router.post("/auth/resend-otp", authController.resendOtp);

router.post("/auth/login", authController.loginUser);

router.post(
  "/auth/forgot-password/request-otp",
  authController.forgotPasswordRequestOtp,
);
router.post(
  "/auth/forgot-password/verify-otp",
  authController.forgotPasswordVerifyOtp,
);
router.post(
  "/auth/forgot-password/reset-password",
  authController.resetPassword,
);
router.post(
  "/auth/forgot-password/resend-otp",
  authController.forgotPasswordResendOtp,
);

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/occasions", require("./occasion.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
router.use("/address", require("./address.routes"));
router.use("/personalization", require("./personalization.routes"));
router.use("/payment", require("./payment.routes"));
router.use("/reviews", require("./review.routes"));
router.use("/testimonials", require("./testimonial.routes"));
router.use("/blog", require("./blog.routes"));
router.use("/contact", require("./contact.routes"));
router.use("/faqs", require("./faq.routes"));
router.use("/privacy-policy", require("./privacyPolicy.routes"));
router.use("/shipping-policy", require("./shippingPolicy.routes"));
router.use("/return-policy", require("./returnPolicy.routes"));
router.use("/story", require("./story.routes"));
router.use("/about", require("./about.routes"));
router.use("/coupons", require("./coupon.routes"));
router.use("/returns", require("./return.routes"));
router.use(
  "/cancel-orders",
  require("./cancel.routes")
);
router.use(
    "/careers",
    require("./career.routes")
);
router.use(
  "/delivery-charges",
  require("./deliveryCharge.routes")
);
router.use("/wishlist", require("./wishlist.routes"));
router.use("/home-info", require("./homeInfo.routes"));
router.use("/videos", require("./video.routes"));
router.use("/bulk-order", require("./bulkOrder.routes"));
router.use("/newsletter", require("./newsletter.routes"));
router.use("/banners", require("./banner.routes"));
router.use("/profile", require("./profile.routes"));
router.use("/shops", require("./shop.routes"));
router.use("/home", require("./home.routes"));

module.exports = router;
