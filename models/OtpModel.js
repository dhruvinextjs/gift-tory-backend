const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    purpose: {
    type: String,
    enum: ["signup", "forgot-password"],
    required: true,
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);