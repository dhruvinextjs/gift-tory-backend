const mongoose = require("mongoose");

const personalizationSchema = new mongoose.Schema(
  {
    // Logged-in User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Guest User
    guestId: {
      type: String,
      default: null,
    },

    // Cart Reference
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    // Delivery Date
    deliveryDate: {
      type: Date,
      default: null,
    },

    // Occasion
    occasion: {
      type: String,
      enum: [
        "Birthday",
        "Anniversary",
        "Wedding",
        "Baby Shower",
        "Valentine",
        "Festival",
        "Other",
      ],
      default: "Other",
    },

    // Personal Message
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    // Sender Name
    senderName: {
      type: String,
      trim: true,
      default: "",
    },

    // Sender Phone
    senderPhone: {
      type: String,
      trim: true,
      default: "",
    },

    deliveryType: {
  type: String,
  default: "Standard Delivery",
},

deliverySlot: {
  type: String,
  default: "",
},

    // Checkbox
    sameAsProfile: {
      type: Boolean,
      default: true,
    },

    keepSurprise: {
    type: Boolean,
    default: false
},
  },
  {
    timestamps: true,
  }
);

personalizationSchema.index(
  { cart: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Personalization",
  personalizationSchema
);