const express = require("express");
const router = express.Router();

const cancelController = require("../../controllers/user/cancel.controller");
const { protectUser } = require("../../middlewares/auth.middleware");

router.post(
  "/",
  protectUser,
  cancelController.createCancelRequest
);

module.exports = router;