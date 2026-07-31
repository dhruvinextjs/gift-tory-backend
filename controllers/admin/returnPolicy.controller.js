const ReturnPolicy = require("../../models/ReturnPolicy");

exports.getReturnPolicy = async (req,res)=>{

    let policy = await ReturnPolicy.findOne();

    if(!policy){

        policy = await ReturnPolicy.create({

            effectiveDate:new Date(),

            content:""

        });

    }

    res.render(
        "admin/return-policy/index",
        {

            title:"Return Policy",

            active:"return-policy",

            policy

        }
    );

};

exports.saveReturnPolicy = async(req,res)=>{

    const {effectiveDate,content}=req.body;

    let policy=await ReturnPolicy.findOne();

    if(policy){

        policy.effectiveDate=effectiveDate;

        policy.content=content;

        await policy.save();

    }else{

        await ReturnPolicy.create({

            effectiveDate,

            content

        });

    }

    req.flash(
        "success",
        "Return Policy Updated Successfully"
    );

    res.redirect("/admin/return-policy");

};