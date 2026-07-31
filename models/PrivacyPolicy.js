const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
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
  "PrivacyPolicy",
  privacyPolicySchema
);