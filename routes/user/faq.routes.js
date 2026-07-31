const express = require("express");

const router = express.Router();

const faqController = require("../../controllers/user/faq.controller");

router.get("/", faqController.getFaqs);

module.exports = router;