const express = require("express");
const router = express.Router();
const authController = require("../../controllers/admin/auth.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.post("/login", authController.apiLogin);
router.get("/me", protectAdmin, authController.apiGetProfile);

router.post(
  "/change-password",
  protectAdmin,
  authController.changePassword
);

module.exports = router;
