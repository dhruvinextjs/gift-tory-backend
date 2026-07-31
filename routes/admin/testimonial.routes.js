const express = require("express");
const router = express.Router();
const testimonialController = require("../../controllers/admin/testimonial.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", testimonialController.getAllTestimonialsApi);
router.post("/", upload("testimonials").single("image"), testimonialController.createTestimonialApi);
router.put("/:id", upload("testimonials").single("image"), testimonialController.updateTestimonialApi);
router.delete("/:id", testimonialController.deleteTestimonialApi);

module.exports = router;
