const express = require("express");
const router = express.Router();
const occasionController = require("../../controllers/user/occasion.controller");

router.get("/", occasionController.getAllOccasions);
router.get("/:slug", occasionController.getOccasionBySlug);

module.exports = router;
