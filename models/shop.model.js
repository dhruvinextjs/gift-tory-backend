const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
{
    shopName:{
        type:String,
        required:true,
        trim:true
    },

    location:{
        type:String,
        default:""
    },

    description:{
        type:String,
        default:""
    },

    openDays:{
        type:String,
        default:""
    },

    openingTime:{
        type:String,
        default:""
    },

    address:{
        type:String,
        default:""
    },

    phone1:{
        type:String,
        default:""
    },

    phone2:{
        type:String,
        default:""
    },

    personalShopper1:{
        type:String,
        default:""
    },

    personalShopper2:{
        type:String,
        default:""
    },

    personalShopper3:{
        type:String,
        default:""
    },

    images:[
        {
            type:String
        }
    ],

    displayOrder:{
        type:Number,
        default:0
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Shop",shopSchema);