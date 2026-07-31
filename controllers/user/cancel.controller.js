const CancelRequest = require("../../models/orderCancel.model");
const Order = require("../../models/order.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");

exports.createCancelRequest = catchAsync(async (req, res) => {
  const { orderId, reason } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  if (!reason) {
    throw new ApiError(400, "Cancellation reason is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Logged in user can cancel only own order
  if (req.user) {
    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to cancel this order");
    }
  }

  // Already cancelled
  if (order.orderStatus === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  // Existing request check
  const existingRequest = await CancelRequest.findOne({
    order: order._id,
    status: { $in: ["pending", "approved"] }
  });

  if (existingRequest) {
    throw new ApiError(400, "Cancellation request already submitted");
  }

  const cancelRequest = await CancelRequest.create({
    user: req.user ? req.user._id : null,
    guestId: req.user ? null : req.body.guestId,
    order: order._id,
    reason
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      cancelRequest,
      "Cancellation request submitted successfully"
    )
  );
});