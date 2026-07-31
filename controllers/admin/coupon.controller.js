const Coupon = require("../../models/coupon.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// ============ ADMIN PANEL ============

exports.renderCouponList = catchAsync(async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.render("admin/coupons/list", { title: "Coupons", active: "coupons", coupons });
});

exports.renderAddCouponForm = (req, res) => {
  res.render("admin/coupons/add", { title: "Add Coupon", active: "coupons" });
};

exports.createCouponPanel = catchAsync(async (req, res) => {
  await Coupon.create({
    code: req.body.code,
    discountType: req.body.discountType,
    discountValue: req.body.discountValue,
    minOrderAmount: req.body.minOrderAmount || 0,
    maxDiscountAmount: req.body.maxDiscountAmount || undefined,
    expiryDate: req.body.expiryDate,
    usageLimit: req.body.usageLimit || 100,
    isActive: req.body.isActive === "on",
  });
  req.flash("success", "Coupon created successfully");
  res.redirect("/admin/coupons");
});

exports.deleteCouponPanel = catchAsync(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  req.flash("success", "Coupon deleted successfully");
  res.redirect("/admin/coupons");
});

exports.toggleActiveCouponPanel = catchAsync(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    req.flash("error", "Coupon not found");
    return res.redirect("/admin/coupons");
  }
  coupon.isActive = !coupon.isActive;
  await coupon.save();
  req.flash("success", "Coupon status updated");
  res.redirect("/admin/coupons");
});

// ============ ADMIN API ============

exports.getAllCouponsApi = catchAsync(async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.status(200).json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

exports.createCouponApi = catchAsync(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

exports.updateCouponApi = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new ApiError(404, "Coupon not found");
  res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

exports.deleteCouponApi = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, "Coupon not found");
  res.status(200).json(new ApiResponse(200, null, "Coupon deleted successfully"));
});
