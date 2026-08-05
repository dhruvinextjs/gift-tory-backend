const mongoose = require("mongoose");

const deliveryChargeSchema = new mongoose.Schema(
  {
    deliveryType: {
      type: String,
      enum: [
        "Standard Delivery",
        "Fixed Time Delivery",
        "Early Morning Delivery",
        "Midnight Delivery",
      ],
      required: true,
      unique: true,
    },

deliveryCharge: {
    type: Number,
    required: true
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DeliveryCharge",
  deliveryChargeSchema
);