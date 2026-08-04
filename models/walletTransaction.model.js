const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: [
            "credit",
            "debit"
        ],
        required: true
    },

    source: {
        type: String,
        enum: [
            "referral",
            "order",
            "refund",
            "manual"
        ],
        default: "referral"
    },

    description: {
        type: String,
        default: ""
    },

    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Referral",
        default: null
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "WalletTransaction",
    walletTransactionSchema
);