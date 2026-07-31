const mongoose = require("mongoose");

const orderCancelSchema = new mongoose.Schema(
  {
    // Logged In User
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

    // Order Reference
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Selected Reason
    reason: {
      type: String,
      enum: [
        "Item no longer required",
        "Found a better alternative",
        "Delivery taking too long",
        "Wrong item ordered",
        "Other",
      ],
      required: true,
    },

    // Required only if reason = Other
    otherReason: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (value) {
          if (this.reason === "Other") {
            return value && value.trim().length > 0;
          }
          return true;
        },
        message: "Other reason is required.",
      },
    },

    // Optional Comment
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Admin Status
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "refunded",
      ],
      default: "pending",
    },

    // Admin Remark
    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },

    // Request Date
    requestedAt: {
      type: Date,
      default: Date.now,
    },

    // Completed Date
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrderCancel",
  orderCancelSchema
);