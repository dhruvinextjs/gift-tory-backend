const BulkOrder = require("../../models/bulkOrder.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// ============ ADMIN PANEL ============

exports.renderBulkOrderList = catchAsync(async (req, res) => {
  const enquiries = await BulkOrder.find().sort("-createdAt");
  res.render("admin/enquiries/bulkOrder", { title: "Bulk Order Enquiries", active: "bulkOrder", enquiries });
});

exports.updateBulkOrderStatusPanel = catchAsync(async (req, res) => {
  const enquiry = await BulkOrder.findById(req.params.id);
  if (!enquiry) {
    req.flash("error", "Enquiry not found");
    return res.redirect("/admin/enquiries/bulk-order");
  }
  enquiry.status = req.body.status;
  await enquiry.save();
  req.flash("success", "Status updated successfully");
  res.redirect("/admin/enquiries/bulk-order");
});

exports.deleteBulkOrderPanel = catchAsync(async (req, res) => {
  await BulkOrder.findByIdAndDelete(req.params.id);
  req.flash("success", "Enquiry deleted successfully");
  res.redirect("/admin/enquiries/bulk-order");
});

// ============ ADMIN API ============

exports.getAllBulkOrdersApi = catchAsync(async (req, res) => {
  const enquiries = await BulkOrder.find().sort("-createdAt");
  res.status(200).json(new ApiResponse(200, enquiries, "Bulk order enquiries fetched successfully"));
});

exports.updateBulkOrderStatusApi = catchAsync(async (req, res) => {
  const enquiry = await BulkOrder.findById(req.params.id);
  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  enquiry.status = req.body.status;
  await enquiry.save();
  res.status(200).json(new ApiResponse(200, enquiry, "Status updated successfully"));
});

exports.deleteBulkOrderApi = catchAsync(async (req, res) => {
  const enquiry = await BulkOrder.findByIdAndDelete(req.params.id);
  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  res.status(200).json(new ApiResponse(200, null, "Enquiry deleted successfully"));
});
