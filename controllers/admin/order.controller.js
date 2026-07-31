const Order = require("../../models/order.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

// ============ ADMIN PANEL ============

// @desc    List all orders (panel)
// @route   GET /admin/orders
exports.renderOrderList = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const status = req.query.status || "";

  const filter = status ? { orderStatus: status } : {};

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.render("admin/orders/list", {
    title: "Orders",
    active: "orders",
    orders,
    status,
    statuses: ORDER_STATUSES,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Render single order detail (panel)
// @route   GET /admin/orders/:id
exports.renderOrderDetail = catchAsync(async (req, res) => {
const order = await Order.findById(req.params.id)
  .populate("user", "name email phone")
  .populate("items.product", "name images slug price");
  if (!order) {
    req.flash("error", "Order not found");
    return res.redirect("/admin/orders");
  }
  res.render("admin/orders/detail", {
    title: `Order #${order.orderNumber}`,
    active: "orders",
    order,
    statuses: ORDER_STATUSES,
  });
});

// @desc    Update order status (panel)
// @route   POST /admin/orders/:id/status
exports.updateOrderStatusPanel = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    req.flash("error", "Order not found");
    return res.redirect("/admin/orders");
  }
  order.orderStatus = req.body.orderStatus;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
  await order.save();

  req.flash("success", "Order status updated successfully");
  res.redirect(`/admin/orders/${order._id}`);
});

// ============ ADMIN API ============

// @desc    Get all orders (API)
// @route   GET /api/admin/orders
exports.getAllOrdersApi = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product","name images")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      { orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
      "Orders fetched successfully"
    )
  );
});

// @desc    Get single order (API)
// @route   GET /api/admin/orders/:id
exports.getOrderByIdApi = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// @desc    Update order status (API)
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatusApi = catchAsync(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  if (orderStatus) {
    if (!ORDER_STATUSES.includes(orderStatus)) throw new ApiError(400, "Invalid order status");
    order.orderStatus = orderStatus;
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  res.status(200).json(new ApiResponse(200, order, "Order updated successfully"));
});
