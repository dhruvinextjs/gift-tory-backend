const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", categoryController.getAllCategoriesApi);
router.get("/:id", categoryController.getCategoryByIdApi);
router.post("/", upload("categories").single("image"), categoryController.createCategoryApi);
router.put("/:id", upload("categories").single("image"), categoryController.updateCategoryApi);
router.delete("/:id", categoryController.deleteCategoryApi);

module.exports = router;
