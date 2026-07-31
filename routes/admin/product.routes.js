const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/product.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");
const upload = require("../../middlewares/multer.middleware");

router.use(protectAdmin);

router.get("/", productController.getAllProductsApi);
router.get("/:id", productController.getProductByIdApi);
router.post("/", upload("products").array("images", 6), productController.createProductApi);
router.put("/:id", upload("products").array("images", 6), productController.updateProductApi);
router.delete("/:id", productController.deleteProductApi);

module.exports = router;
