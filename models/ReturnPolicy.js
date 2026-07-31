const mongoose = require("mongoose");

const returnPolicySchema = new mongoose.Schema(
{
    effectiveDate:{
        type:Date,
        default:Date.now
    },

    content:{
        type:String,
        default:""
    }
},
{
    timestamps:true
});

module.exports = mongoose.model(
    "ReturnPolicy",
    returnPolicySchema
);