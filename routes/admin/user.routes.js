const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", userController.getAllUsersApi);
router.get("/:id", userController.getUserByIdApi);
router.put("/:id/toggle-block", userController.toggleBlockUserApi);
router.delete("/:id", userController.deleteUserApi);

module.exports = router;
