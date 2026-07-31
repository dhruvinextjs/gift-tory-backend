const mongoose = require("mongoose");

const bulkOrderSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "" },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true },
    productRequirement: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkOrder", bulkOrderSchema);
