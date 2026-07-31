const ReturnRequest = require("../../models/returnRequest.model");
const Order = require("../../models/order.model");

const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// POST /api/user/returns
exports.createReturnRequest = catchAsync(async (req, res) => {
  // ----------------------------
  // Find Order
  // ----------------------------

  const order = await Order.findById(req.body.order);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // ----------------------------
  // Logged In User Validation
  // ----------------------------

  if (req.user) {
    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to access this order");
    }
  } else {
    const guestId = req.headers["x-guest-id"];

    if (!guestId || order.guestId !== guestId) {
      throw new ApiError(403, "You are not allowed to access this order");
    }
  }

  // ----------------------------
  // Order Item Validation
  // ----------------------------

  console.log(order.items);

  const orderItem = order.items.find(
    (item) => item._id.toString() === req.body.orderItem,
  );

  if (!orderItem) {
    throw new ApiError(404, "Order item not found");
  }

  // ----------------------------
  // Other Reason Validation
  // ----------------------------

  if (req.body.reason === "Other" && !req.body.otherReason) {
    throw new ApiError(400, "Other reason is required");
  }

  // ----------------------------
  // Images
  // ----------------------------

  let images = [];

  if (req.files) {
    images = req.files.map((file) => file.filename);
  }

  // ----------------------------
  // Duplicate Request Check
  // ----------------------------

  const existingRequest = await ReturnRequest.findOne({
    order: order._id,

    orderItem: req.body.orderItem,

    status: {
      $in: ["pending", "approved"],
    },
  });

  if (existingRequest) {
    throw new ApiError(400, "Return request already exists for this product");
  }

  // ----------------------------
  // Create Request
  // ----------------------------

  const request = await ReturnRequest.create({
    user: req.user ? req.user._id : null,

    guestId: req.user ? null : req.headers["x-guest-id"],

    order: order._id,

    orderItem: req.body.orderItem,

    requestType: req.body.requestType,

    reason: req.body.reason,

    otherReason: req.body.otherReason,

    comment: req.body.comment,

    images,
  });

  res.status(201).json(
    new ApiResponse(
      201,

      request,

      "Return request submitted successfully",
    ),
  );
});

// GET /api/user/returns

exports.getMyReturnRequests = catchAsync(async (req, res) => {
  let filter = {};

  if (req.user) {
    filter.user = req.user._id;
  } else {
    const guestId = req.headers["x-guest-id"];

    if (!guestId) {
      throw new ApiError(400, "Guest Id is required");
    }

    filter.guestId = guestId;
  }

  const requests = await ReturnRequest.find(filter)

    .populate("order", "orderNumber")

    .sort("-createdAt");

  const data = requests.map((request) => {
    return {
      _id: request._id,

      requestType: request.requestType,

      reason: request.reason,

      status: request.status,

      createdAt: request.createdAt,

      order: request.order,

      product: null,
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,

      data,

      "Return requests fetched successfully",
    ),
  );
});
