const BulkOrder = require("../../models/bulkOrder.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Submit a bulk / corporate order enquiry
// @route   POST /api/user/bulk-order
exports.submitBulkOrder = catchAsync(async (req, res) => {
  const { companyName, contactPerson, email, phone, quantity, productRequirement, message } = req.body;

  if (!contactPerson || !email || !phone || !quantity || !productRequirement) {
    throw new ApiError(400, "Please fill all required fields");
  }

  const enquiry = await BulkOrder.create({
    companyName,
    contactPerson,
    email,
    phone,
    quantity,
    productRequirement,
    message,
  });

  res.status(201).json(new ApiResponse(201, enquiry, "Bulk order enquiry submitted successfully"));
});
