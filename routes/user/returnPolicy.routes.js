const express=require("express");

const router=express.Router();

const controller=require("../../controllers/user/returnPolicy.controller");

router.get(
    "/",
    controller.getReturnPolicy
);

module.exports=router;