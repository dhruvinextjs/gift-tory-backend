const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true }, // price at time of adding
  },
  { _id: true },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    guestId: {
    type: String,
    default: null
},
    items: [cartItemSchema],

    couponCode: {
    type: String,
    default: ""
},
deliveryType: {
    type: String,
    default: "Standard Delivery"
},

deliverySlot: {
    type: String,
    default: ""
},

couponDiscount: {
    type: Number,
    default: 0
},
  },
  { timestamps: true },
);

cartSchema.virtual("totalAmount").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Cart", cartSchema);
