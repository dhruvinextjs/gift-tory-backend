const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/admin/blog.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", blogController.getAllBlogsApi);
router.post("/", upload("blogs").single("coverImage"), blogController.createBlogApi);
router.put("/:id", upload("blogs").single("coverImage"), blogController.updateBlogApi);
router.delete("/:id", blogController.deleteBlogApi);

module.exports = router;
