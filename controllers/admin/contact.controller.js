const Contact = require("../../models/contact.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// ============ ADMIN PANEL ============

exports.renderContactList = catchAsync(async (req, res) => {
  const contacts = await Contact.find().sort("-createdAt");
  res.render("admin/enquiries/contact", { title: "Contact Enquiries", active: "contact", contacts });
});

exports.updateContactStatusPanel = catchAsync(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    req.flash("error", "Enquiry not found");
    return res.redirect("/admin/enquiries/contact");
  }
  contact.status = req.body.status;
  await contact.save();
  req.flash("success", "Status updated successfully");
  res.redirect("/admin/enquiries/contact");
});

exports.deleteContactPanel = catchAsync(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  req.flash("success", "Enquiry deleted successfully");
  res.redirect("/admin/enquiries/contact");
});

// ============ ADMIN API ============

exports.getAllContactsApi = catchAsync(async (req, res) => {
  const contacts = await Contact.find().sort("-createdAt");
  res.status(200).json(new ApiResponse(200, contacts, "Contact enquiries fetched successfully"));
});

exports.updateContactStatusApi = catchAsync(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, "Enquiry not found");
  contact.status = req.body.status;
  await contact.save();
  res.status(200).json(new ApiResponse(200, contact, "Status updated successfully"));
});

exports.deleteContactApi = catchAsync(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new ApiError(404, "Enquiry not found");
  res.status(200).json(new ApiResponse(200, null, "Enquiry deleted successfully"));
});
