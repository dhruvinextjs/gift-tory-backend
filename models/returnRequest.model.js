const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
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

    // Particular Product of Order
    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Return or Replacement
    requestType: {
      type: String,
      enum: ["return", "replacement"],
      required: true,
    },

    // Selected Reason
    reason: {
      type: String,
      enum: [
        "Item arrived damaged",
        "Wrong item received",
        "Item different from description",
        "Missing parts / accessories",
        "Quality not as expected",
        "Defective on arrival",
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

    // Uploaded Images
images: {
  type: [String],
  default: [],
  validate: {
    validator: function (value) {
      return value.length <= 4;
    },
    message: "Maximum 4 images are allowed",
  },
},

    // User Comment
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
        "completed",
      ],
      default: "pending",
    },

    // Admin Remark
    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },

    // Dates
    requestedAt: {
      type: Date,
      default: Date.now,
    },

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
  "ReturnRequest",
  returnRequestSchema
);