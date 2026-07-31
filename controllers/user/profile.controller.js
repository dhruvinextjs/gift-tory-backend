const User = require("../../models/user.model");

exports.getProfile = async (req,res)=>{

    const user = await User.findById(req.user.id)
        .select("-password");

    res.status(200).json({

        success:true,

        data:user

    });

};

exports.updateProfile = async(req,res)=>{

    const {name,email,phone}=req.body;

    const user=await User.findById(req.user.id);

    if(!user){

        return res.status(404).json({

            success:false,
            message:"User not found"

        });

    }

    if(email){

        const emailExist=await User.findOne({

            email,
            _id:{$ne:user._id}

        });

        if(emailExist){

            return res.status(400).json({

                success:false,
                message:"Email already exists"

            });

        }

    }

    if(phone){

        const phoneExist=await User.findOne({

            phone,
            _id:{$ne:user._id}

        });

        if(phoneExist){

            return res.status(400).json({

                success:false,
                message:"Phone already exists"

            });

        }

    }

    user.name=name;
    user.email=email;
    user.phone=phone;

    await user.save();

    res.status(200).json({

        success:true,

        message:"Profile updated successfully",

        data:user

    });

};