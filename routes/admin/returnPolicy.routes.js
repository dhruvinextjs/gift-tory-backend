const express=require("express");

const router=express.Router();

const controller=require("../../controllers/admin/returnPolicy.controller");

router.get(
    "/",
    controller.getReturnPolicy
);

router.post(
    "/",
    controller.saveReturnPolicy
);

module.exports=router;