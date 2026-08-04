const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
{
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        default: "",
        trim: true
    },

    email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: true
    },

    referralCode: {
    type: String,
    unique: true,
    sparse: true
},

referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

},
{
    timestamps: true
});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);

    next();

});

userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(
        password,
        this.password
    );

};

module.exports = mongoose.model("User",userSchema);