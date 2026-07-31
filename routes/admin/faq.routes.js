const express = require("express");

const router = express.Router();

const faqController = require("../../controllers/admin/faq.controller");

// List
router.get("/", faqController.listFaqs);

// Add
router.get("/add", faqController.addFaqPage);
router.post("/add", faqController.addFaq);

// Edit
router.get("/edit/:id", faqController.editFaqPage);
router.post("/edit/:id", faqController.updateFaq);

// Delete
router.post("/delete/:id", faqController.deleteFaq);

module.exports = router;