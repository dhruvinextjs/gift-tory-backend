const PrivacyPolicy=require("../../models/PrivacyPolicy");

exports.getPrivacyPolicy=async(req,res)=>{

const policy=await PrivacyPolicy.findOne();

res.status(200).json({

success:true,

data:policy

});

}