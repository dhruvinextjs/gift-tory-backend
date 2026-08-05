const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const calculateCartSummary = require("../../utils/cartSummary");
const Coupon = require("../../models/coupon.model");
const DeliveryCharge = require("../../models/deliveryCharge.model");
const DeliverySlot = require("../../models/deliverySlot.model");

// @desc    Place a new order (checkout from cart)
// @route   POST /api/user/orders
// body: { shippingAddress, paymentMethod, couponCode, isSameDayDelivery }
exports.placeOrder = catchAsync(async (req, res) => {
const {
  shippingAddress,
  paymentMethod,
  deliveryType,
  deliverySlot,
  cardHolderName,
  cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  isSameDayDelivery,
  notes,
} = req.body;

  if (!shippingAddress) throw new ApiError(400, "Shipping address is required");

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

const Personalization = require("../../models/personalization.model");

const personalization = await Personalization.findOne({
    cart: cart._id,
});

if (personalization) {
    cart.deliveryType = personalization.deliveryType || "Standard Delivery";
    cart.deliverySlot = personalization.deliverySlot || "";

    await cart.save();
}

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  const summary = await calculateCartSummary(cart);

  if (!cart || cart.items.length === 0)
    throw new ApiError(400, "Your cart is empty");

  // Validate stock & build order items
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      throw new ApiError(400, "Product no longer available");
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: item.price,
      quantity: item.quantity,
    });
  }

  //--------------------------------------------------
// Payment Validation
//--------------------------------------------------

const allowedMethods = [
  "COD",
  "CARD",
  "WALLET",
  "QR",
];

if (
  !paymentMethod ||
  !allowedMethods.includes(paymentMethod)
) {
  throw new ApiError(
    400,
    "Invalid payment method"
  );
}

let cardDetails = {
  cardHolderName: "",
  last4Digits: "",
};

if (paymentMethod === "CARD") {

  if (
    !cardHolderName ||
    !cardNumber ||
    !expiryMonth ||
    !expiryYear ||
    !cvv
  ) {
    throw new ApiError(
      400,
      "Complete card details are required"
    );
  }

  cardDetails = {
    cardHolderName,
    last4Digits: cardNumber.slice(-4),
  };
}

  const order = await Order.create({
    user: req.user._id,

    items: orderItems,

    shippingAddress,

    itemsPrice: summary.mrpTotal,

    discount: summary.productDiscount + summary.couponDiscount,

    shippingPrice: summary.deliveryCharge,

    deliveryType: cart.deliveryType,

deliverySlot: cart.deliverySlot,

    totalPrice: summary.grandTotal,

    paymentMethod,

    paymentStatus:
  paymentMethod === "COD"
    ? "pending"
    : "paid",

    cardDetails,

    couponCode: summary.couponCode,

    isSameDayDelivery: !!isSameDayDelivery,
    productDiscount: summary.productDiscount,

    couponDiscount: summary.couponDiscount,

    notes,
  });

  if (summary.couponCode) {
    await Coupon.findOneAndUpdate(
      {
        code: summary.couponCode,
      },
      {
        $inc: {
          usedCount: 1,
        },
      },
    );
  }
  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
cart.items = [];

cart.couponCode = "";

cart.couponDiscount = 0;

cart.deliveryType = "Standard Delivery";

cart.deliverySlot = "";

await cart.save();

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

// @desc    Get logged-in user's orders
// @route   GET /api/user/orders
exports.getMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name images slug")
    .sort("-createdAt");
  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// @desc    Get single order detail (must belong to logged-in user)
// @route   GET /api/user/orders/:id
exports.getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, "Order not found");
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// @desc    Cancel an order (only if not shipped yet)
// @route   PUT /api/user/orders/:id/cancel
exports.cancelOrder = catchAsync(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new ApiError(404, "Order not found");

  if (
    ["shipped", "out_for_delivery", "delivered"].includes(order.orderStatus)
  ) {
    throw new ApiError(400, "This order can no longer be cancelled");
  }

  order.orderStatus = "cancelled";
  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  } else {
    order.paymentStatus = "failed";
  }
  await order.save();

  // Restock items
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});
