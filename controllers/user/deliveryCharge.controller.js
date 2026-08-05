const DeliveryCharge = require("../../models/deliveryCharge.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

exports.getDeliveryCharges = catchAsync(async (req, res) => {

  const deliveryCharges = await DeliveryCharge.find({
    isActive: true,
  }).sort({
    deliveryType: 1,
    timeSlot: 1,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      deliveryCharges,
      "Delivery charges fetched successfully"
    )
  );

});