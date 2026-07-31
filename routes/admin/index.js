// ==========================================================
//  ADMIN REST API ROUTES  -> mounted at /api/admin
//  All routes (except /auth/login) require a valid admin JWT
// ==========================================================
const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/products", require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/occasions", require("./occasion.routes"));
router.use("/orders", require("./order.routes"));
router.use("/users", require("./user.routes"));
router.use("/reviews", require("./review.routes"));
router.use("/testimonials", require("./testimonial.routes"));
router.use(
    "/returns",
    require("./return.routes")
);
router.use("/blogs", require("./blog.routes"));
router.use("/banners", require("./banner.routes"));
router.use("/contact", require("./contact.routes"));
router.use("/faqs", require("./faq.routes"));
router.use("/bulk-order", require("./bulkOrder.routes"));
router.use("/coupons", require("./coupon.routes"));

module.exports = router;
