// ==========================================================
//  ADMIN PANEL VIEW ROUTES (EJS Server-Rendered Pages)
//  Mounted at /admin  -> protected by session (requireAdminSession)
// ==========================================================
const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/multer.middleware");
const { requireAdminSession, redirectIfAdminLoggedIn } = require("../../middlewares/adminAuth.middleware");

const authController = require("../../controllers/admin/auth.controller");
const dashboardController = require("../../controllers/admin/dashboard.controller");
const productController = require("../../controllers/admin/product.controller");
const categoryController = require("../../controllers/admin/category.controller");
const occasionController = require("../../controllers/admin/occasion.controller");
const orderController = require("../../controllers/admin/order.controller");
const userController = require("../../controllers/admin/user.controller");
const reviewController = require("../../controllers/admin/review.controller");
const testimonialController = require("../../controllers/admin/testimonial.controller");
const blogController = require("../../controllers/admin/blog.controller");
const bannerController = require("../../controllers/admin/banner.controller");
const contactController = require("../../controllers/admin/contact.controller");
const bulkOrderController = require("../../controllers/admin/bulkOrder.controller");
const couponController = require("../../controllers/admin/coupon.controller");
const faqController = require("../../controllers/admin/faq.controller");
const returnController = require("../../controllers/admin/return.controller");
const cancelController = require("../../controllers/admin/cancel.controller");
const careerController = require("../../controllers/admin/career.controller");
const deliveryChargeController = require("../../controllers/admin/deliveryCharge.controller");

// ---------- Auth ----------
router.get("/login", redirectIfAdminLoggedIn, authController.renderLoginPage);
router.post("/login", authController.panelLogin);
router.get("/logout", authController.panelLogout);

// Everything below requires an active admin session
router.use(requireAdminSession);

// ---------- Dashboard ----------
router.get("/", (req, res) => res.redirect("/admin/dashboard"));
router.get("/dashboard", dashboardController.renderDashboard);

// ---------- Products ----------
router.get("/products", productController.renderProductList);
router.get("/products/add", productController.renderAddProductForm);
router.post("/products/add", upload("products").array("images", 6), productController.createProductPanel);
router.get("/products/edit/:id", productController.renderEditProductForm);
router.post("/products/edit/:id", upload("products").array("images", 6), productController.updateProductPanel);
router.post("/products/delete/:id", productController.deleteProductPanel);

// ---------- Categories ----------
router.get("/categories", categoryController.renderCategoryList);
router.get("/categories/add", categoryController.renderAddCategoryForm);
router.post("/categories/add", upload("categories").single("image"), categoryController.createCategoryPanel);
router.get("/categories/edit/:id", categoryController.renderEditCategoryForm);
router.post("/categories/edit/:id", upload("categories").single("image"), categoryController.updateCategoryPanel);
router.post("/categories/delete/:id", categoryController.deleteCategoryPanel);

// ---------- Occasions ----------
router.get("/occasions", occasionController.renderOccasionList);
router.get("/occasions/add", occasionController.renderAddOccasionForm);
router.post("/occasions/add", upload("occasions").single("image"), occasionController.createOccasionPanel);
router.get("/occasions/edit/:id", occasionController.renderEditOccasionForm);
router.post("/occasions/edit/:id", upload("occasions").single("image"), occasionController.updateOccasionPanel);
router.post("/occasions/delete/:id", occasionController.deleteOccasionPanel);

// ---------- Orders ----------
router.get("/orders", orderController.renderOrderList);
router.get("/orders/:id", orderController.renderOrderDetail);
router.post("/orders/:id/status", orderController.updateOrderStatusPanel);

// ---------- Users ----------
router.get("/users", userController.renderUserList);
router.post("/users/:id/toggle-block", userController.toggleBlockUserPanel);

// ---------- Reviews ----------
router.get("/reviews", reviewController.renderReviewList);
router.post("/reviews/:id/toggle-approve", reviewController.toggleApproveReviewPanel);
router.post("/reviews/:id/delete", reviewController.deleteReviewPanel);

// ---------- Testimonials ----------
router.get("/testimonials", testimonialController.renderTestimonialList);
router.get("/testimonials/add", testimonialController.renderAddTestimonialForm);
router.post("/testimonials/add", upload("testimonials").single("image"), testimonialController.createTestimonialPanel);
router.get("/testimonials/edit/:id", testimonialController.renderEditTestimonialForm);
router.post("/testimonials/edit/:id", upload("testimonials").single("image"), testimonialController.updateTestimonialPanel);
router.post("/testimonials/delete/:id", testimonialController.deleteTestimonialPanel);

// ---------- Blogs ----------
router.get("/blogs", blogController.renderBlogList);
router.get("/blogs/add", blogController.renderAddBlogForm);
router.post("/blogs/add", upload("blogs").single("coverImage"), blogController.createBlogPanel);
router.get("/blogs/edit/:id", blogController.renderEditBlogForm);
router.post("/blogs/edit/:id", upload("blogs").single("coverImage"), blogController.updateBlogPanel);
router.post("/blogs/delete/:id", blogController.deleteBlogPanel);

// ---------- Banners ----------
router.get("/banners", bannerController.renderBannerList);
router.get("/banners/add", bannerController.renderAddBannerForm);
router.post("/banners/add", upload("banners").single("image"), bannerController.createBannerPanel);
router.post("/banners/:id/toggle-active", bannerController.toggleActiveBannerPanel);
router.post("/banners/delete/:id", bannerController.deleteBannerPanel);

// ---------- Enquiries: Contact ----------
router.get("/enquiries/contact", contactController.renderContactList);
router.post("/enquiries/contact/:id/status", contactController.updateContactStatusPanel);
router.post("/enquiries/contact/:id/delete", contactController.deleteContactPanel);

// ---------- Enquiries: Bulk Order ----------
router.get("/enquiries/bulk-order", bulkOrderController.renderBulkOrderList);
router.post("/enquiries/bulk-order/:id/status", bulkOrderController.updateBulkOrderStatusPanel);
router.post("/enquiries/bulk-order/:id/delete", bulkOrderController.deleteBulkOrderPanel);

// ---------- Coupons ----------
router.get("/coupons", couponController.renderCouponList);
router.get("/coupons/add", couponController.renderAddCouponForm);
router.post("/coupons/add", couponController.createCouponPanel);
router.post("/coupons/:id/toggle-active", couponController.toggleActiveCouponPanel);
router.post("/coupons/delete/:id", couponController.deleteCouponPanel);


// ---------- FAQs ----------
router.get("/faqs", faqController.listFaqs);
router.get("/faqs/add", faqController.addFaqPage);
router.post("/faqs/add", faqController.addFaq);
router.get("/faqs/edit/:id", faqController.editFaqPage);
router.post("/faqs/edit/:id", faqController.updateFaq);
router.post("/faqs/delete/:id", faqController.deleteFaq);

router.use(
"/privacy-policy",
require("./privacyPolicy.routes")
);

router.use(
    "/shipping-policy",
    require("./shippingPolicy.routes")
);

router.use(
    "/return-policy",
    require("./returnPolicy.routes")
);

router.use(
    "/about-us",
    require("./aboutUs.routes")
);

router.use(
    "/home-info",
    require("./homeInfo.routes")
);

router.use(
    "/videos",
    require("./video.routes")
);

router.use(
    "/shops",
    require("./shop.routes")
);


// ---------- Return Requests ----------
router.get(
   "/returns",
   returnController.renderReturnRequests
);

router.get(
    "/returns/:id",
    returnController.renderReturnRequestDetail
);

router.post(
    "/returns/:id/status",
    returnController.updateReturnRequestStatus
);

// ---------- Cancel Requests ----------
router.get(
    "/cancel-requests",
    cancelController.renderCancelRequests
);

router.get(
    "/cancel-requests/:id",
    cancelController.renderCancelRequestDetail
);

router.post(
    "/cancel-requests/:id/status",
    cancelController.updateCancelRequestStatus
);
// ---------- Careers ----------
router.get(
    "/careers",
    careerController.renderCareerList
);

router.get(
    "/careers/add",
    careerController.renderAddCareer
);

router.post(
    "/careers/add",
    careerController.createCareer
);

router.get(
    "/careers/edit/:id",
    careerController.renderEditCareer
);

router.post(
    "/careers/edit/:id",
    careerController.updateCareer
);

router.post(
    "/careers/delete/:id",
    careerController.deleteCareer
);

// ---------- Delivery Charges ----------

router.get(
  "/delivery-charges",
  deliveryChargeController.renderDeliveryChargeList
);

router.get(
  "/delivery-charges/add",
  deliveryChargeController.renderAddDeliveryCharge
);

router.post(
  "/delivery-charges/create",
  deliveryChargeController.createDeliveryCharge
);

router.get(
  "/delivery-charges/edit/:id",
  deliveryChargeController.renderEditDeliveryCharge
);

router.post(
  "/delivery-charges/edit/:id",
  deliveryChargeController.updateDeliveryCharge
);

router.post(
  "/delivery-charges/delete/:id",
  deliveryChargeController.deleteDeliveryCharge
);

module.exports = router;
