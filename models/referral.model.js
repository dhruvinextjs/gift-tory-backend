const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
{
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    referredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    referralCode: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "completed"
        ],
        default: "pending"
    },

    rewardAmount: {
        type: Number,
        default: 100
    },

    rewardedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "Referral",
    referralSchema
);