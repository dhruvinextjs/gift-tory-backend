const mongoose = require("mongoose");

const shippingPolicySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ShippingPolicy",
  shippingPolicySchema
);