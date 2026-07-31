const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/admin/banner.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", bannerController.getAllBannersApi);
router.post("/", upload("banners").single("image"), bannerController.createBannerApi);
router.put("/:id", upload("banners").single("image"), bannerController.updateBannerApi);
router.delete("/:id", bannerController.deleteBannerApi);

module.exports = router;
