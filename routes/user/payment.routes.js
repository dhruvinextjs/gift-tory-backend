const express = require("express");

const router = express.Router();

const paymentController = require("../../controllers/user/payment.controller");

const {
    protectUser
} = require("../../middlewares/auth.middleware");

router.get(
    "/summary",
    protectUser,
    paymentController.getPaymentSummary
);

module.exports = router;