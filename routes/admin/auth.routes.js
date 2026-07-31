const express = require("express");
const router = express.Router();
const authController = require("../../controllers/admin/auth.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.post("/login", authController.apiLogin);
router.get("/me", protectAdmin, authController.apiGetProfile);

module.exports = router;
