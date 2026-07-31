const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/profile.controller");

const { protectUser } = require("../../middlewares/auth.middleware");

// Get Profile
router.get(
    "/",
    protectUser,
    controller.getProfile
);

// Update Profile
router.put(
    "/",
    protectUser,
    controller.updateProfile
);

module.exports = router;