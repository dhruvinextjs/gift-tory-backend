const express = require("express");
const router = express.Router();

const careerController = require("../../controllers/user/career.controller");

router.get("/", careerController.getCareers);

module.exports = router;