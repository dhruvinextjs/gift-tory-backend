const express = require("express");

const router = express.Router();

const returnController = require("../../controllers/user/return.controller");

const upload = require("../../middlewares/multer.middleware");

const { optionalUser } = require("../../middlewares/auth.middleware");

const uploadReturn = upload("returns");

router.post(
  "/",

  optionalUser,

  uploadReturn.array("images", 4),

  returnController.createReturnRequest,
);

router.get(
    "/",
    optionalUser,
    returnController.getMyReturnRequests
);

module.exports = router;
