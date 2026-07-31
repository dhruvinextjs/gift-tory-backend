const Contact = require("../../models/contact.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Submit a contact us enquiry
// @route   POST /api/user/contact
exports.submitContact = catchAsync(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email and message are required");
  }

  const contact = await Contact.create({ name, email, phone, subject, message });
  res.status(201).json(new ApiResponse(201, contact, "Your message has been sent. We'll get back to you soon!"));
});
