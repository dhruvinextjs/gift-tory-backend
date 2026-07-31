const express=require("express");

const router=express.Router();

const controller=require("../../controllers/admin/privacyPolicy.controller");

router.get(
"/",
controller.getPrivacyPolicy
);

router.post(
"/",
controller.savePrivacyPolicy
);

module.exports=router;