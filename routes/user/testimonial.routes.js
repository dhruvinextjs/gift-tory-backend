const express = require("express");
const router = express.Router();
const testimonialController = require("../../controllers/user/testimonial.controller");

router.get("/", testimonialController.getAllTestimonials);

module.exports = router;
