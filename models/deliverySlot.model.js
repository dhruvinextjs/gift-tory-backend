const mongoose = require("mongoose");

const deliverySlotSchema = new mongoose.Schema(
  {
    deliveryType: {
      type: String,
      enum: [
        "Fixed Time Delivery",
        "Early Morning Delivery",
        "Midnight Delivery",
      ],
      required: true,
    },

    slot: {
      type: String,
      required: true,
    },

    charge: {
      type: Number,
      required: true,
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
  "DeliverySlot",
  deliverySlotSchema
);