const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboard.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.get("/stats", protectAdmin, dashboardController.getStats);

module.exports = router;
