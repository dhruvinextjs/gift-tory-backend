const express=require("express");

const router=express.Router();

const controller=require("../../controllers/user/privacyPolicy.controller");

router.get(
"/",
controller.getPrivacyPolicy
);

module.exports=router;