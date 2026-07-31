const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
{
    creatorName:{
        type:String,
        required:true,
        trim:true
    },

    creatorImage:{
        type:String,
        default:""
    },

    video:{
        type:String,
        required:true
    },

    title:{
        type:String,
        default:""
    },

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

module.exports = mongoose.model(
    "Video",
    videoSchema
);