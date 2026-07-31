const express = require("express");
const router = express.Router();
const occasionController = require("../../controllers/admin/occasion.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", occasionController.getAllOccasionsApi);
router.get("/:id", occasionController.getOccasionByIdApi);
router.post("/", upload("occasions").single("image"), occasionController.createOccasionApi);
router.put("/:id", upload("occasions").single("image"), occasionController.updateOccasionApi);
router.delete("/:id", occasionController.deleteOccasionApi);

module.exports = router;
