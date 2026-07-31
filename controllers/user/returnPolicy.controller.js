const ReturnPolicy=require("../../models/ReturnPolicy");

exports.getReturnPolicy=async(req,res)=>{

    try{

        const policy=await ReturnPolicy.findOne();

        return res.status(200).json({

            success:true,

            message:"Return Policy fetched successfully",

            data:policy

        });

    }catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};