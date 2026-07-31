const PrivacyPolicy = require("../../models/PrivacyPolicy");

exports.getPrivacyPolicy = async (req,res)=>{

    let policy = await PrivacyPolicy.findOne();

    if(!policy){

        policy = await PrivacyPolicy.create({

            content:""

        });

    }

    res.render(
        "admin/privacy-policy/index",
        {

            title:"Privacy Policy",
            active: "privacy-policy",
            policy

        }

    );

}


exports.savePrivacyPolicy = async(req,res)=>{

    const {content}=req.body;

    let policy=await PrivacyPolicy.findOne();

    if(policy){

        policy.content=content;

        await policy.save();

    }else{

        await PrivacyPolicy.create({

            content

        });

    }

    req.flash(
        "success",
        "Privacy Policy Updated Successfully"
    );

    res.redirect("/admin/privacy-policy");

}