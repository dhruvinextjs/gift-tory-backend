const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},
    reviewerName:{
    type:String,
    default:""
},

reviewerEmail:{
    type:String,
    default:""
},
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index(
    { product: 1, user: 1 },
    {
        unique: true,
        partialFilterExpression: {
            user: { $exists: true, $ne: null }
        }
    }
);

module.exports = mongoose.model("Review", reviewSchema);
