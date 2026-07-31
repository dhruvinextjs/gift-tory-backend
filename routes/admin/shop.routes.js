const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/shop.controller");

const upload = require("../../middlewares/multer.middleware");

const { requireAdminSession } = require("../../middlewares/adminAuth.middleware");

router.use(requireAdminSession);

// List
router.get(
    "/",
    controller.getShops
);

// Create
router.post(
    "/",
    upload("shops").array("images",10),
    controller.createShop
);

// Delete
router.post(
    "/delete/:id",
    controller.deleteShop
);

module.exports = router;