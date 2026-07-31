const express = require("express");
const router = express.Router();

const careerController = require("../../controllers/admin/career.controller");

router.get("/", careerController.renderCareerList);

router.get("/add", careerController.renderAddCareer);
router.post("/add", careerController.createCareer);

router.get("/edit/:id", careerController.renderEditCareer);
router.post("/edit/:id", careerController.updateCareer);

router.post("/delete/:id", careerController.deleteCareer);

module.exports = router;