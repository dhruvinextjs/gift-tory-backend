const express = require("express");
const router = express.Router();

const personalizationController = require("../../controllers/user/personalization.controller");
const {
    optionalUser
} = require("../../middlewares/auth.middleware");

// Guest + Login dono support
router.use(optionalUser);

// Save / Update
router.post(
    "/",
    personalizationController.savePersonalization
);

// Get
router.get(
    "/",
    personalizationController.getPersonalization
);

// Delete
router.delete(
    "/",
    personalizationController.deletePersonalization
);

router.put("/:id", personalizationController.updatePersonalization);

module.exports = router;