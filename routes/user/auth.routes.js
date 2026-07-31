const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/auth.controller");
const { protectUser } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/multer.middleware");


// router.post("/register", authController.register);
// router.post("/login", authController.login);


router.post("/logout", authController.logout);

router.get("/me", protectUser, authController.getProfile);
router.put("/me", protectUser, upload("users").single("avatar"), authController.updateProfile);
router.put("/change-password", protectUser, authController.changePassword);

router.post("/address", protectUser, authController.addAddress);
router.put("/address/:addressId", protectUser, authController.updateAddress);
router.delete("/address/:addressId", protectUser, authController.deleteAddress);

module.exports = router;
