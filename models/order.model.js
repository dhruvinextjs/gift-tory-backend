const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  // { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },


paymentMethod: {
  type: String,
  enum: ["COD", "CARD", "WALLET", "QR"],
  default: "COD",
},

paymentStatus: {
  type: String,
  enum: [
    "pending",
    "paid",
    "failed",
    "refunded",
  ],
  default: "pending",
},

cardDetails: {
  cardHolderName: {
    type: String,
    default: "",
  },

  last4Digits: {
    type: String,
    default: "",
  },
},

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },

    couponCode: { type: String },
    couponDiscount:{
    type:Number,
    default:0
},
productDiscount:{
    type:Number,
    default:0
},
    deliveryDate: { type: Date },
    isSameDayDelivery: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `GT${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
