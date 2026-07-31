const express = require("express");

const router = express.Router();

const controller = require("../../controllers/user/address.controller");

const { protectUser } = require("../../middlewares/auth.middleware");

router.use(protectUser);

router.post("/", controller.addAddress);

router.get("/", controller.getAllAddresses);

router.put("/:id", protectUser, controller.updateAddress);

router.delete("/:id", protectUser, controller.deleteAddress);

router.put("/:id/default", protectUser, controller.setDefaultAddress);

module.exports = router;
