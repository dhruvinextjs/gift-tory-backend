const fs = require("fs");
const path = require("path");
const Banner = require("../../models/banner.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const deleteFile = (folder, filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "..", "uploads", folder, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") console.error("File delete error:", err.message);
  });
};

// ============ ADMIN PANEL ============

exports.renderBannerList = catchAsync(async (req, res) => {
  const banners = await Banner.find().sort("displayOrder");
  res.render("admin/banners/list", { title: "Banners", active: "banners", banners });
});

exports.renderAddBannerForm = (req, res) => {
  res.render("admin/banners/add", { title: "Add Banner", active: "banners" });
};

exports.createBannerPanel = catchAsync(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Banner image is required");
    return res.redirect("/admin/banners/add");
  }
  await Banner.create({
    title: req.body.title,
    subtitle: req.body.subtitle,
    link: req.body.link,
    position: req.body.position || "hero",
    displayOrder: req.body.displayOrder || 0,
    image: req.file.filename,
    isActive: req.body.isActive === "on",
  });
  req.flash("success", "Banner created successfully");
  res.redirect("/admin/banners");
});

exports.deleteBannerPanel = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (banner) deleteFile("banners", banner.image);
  req.flash("success", "Banner deleted successfully");
  res.redirect("/admin/banners");
});

exports.toggleActiveBannerPanel = catchAsync(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    req.flash("error", "Banner not found");
    return res.redirect("/admin/banners");
  }
  banner.isActive = !banner.isActive;
  await banner.save();
  req.flash("success", "Banner status updated");
  res.redirect("/admin/banners");
});

// ============ ADMIN API ============

exports.getAllBannersApi = catchAsync(async (req, res) => {
  const banners = await Banner.find().sort("displayOrder");
  res.status(200).json(new ApiResponse(200, banners, "Banners fetched successfully"));
});

exports.createBannerApi = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Banner image is required");
  const banner = await Banner.create({ ...req.body, image: req.file.filename });
  res.status(201).json(new ApiResponse(201, banner, "Banner created successfully"));
});

exports.updateBannerApi = catchAsync(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, "Banner not found");

  Object.assign(banner, req.body);
  if (req.file) {
    deleteFile("banners", banner.image);
    banner.image = req.file.filename;
  }
  await banner.save();
  res.status(200).json(new ApiResponse(200, banner, "Banner updated successfully"));
});

exports.deleteBannerApi = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError(404, "Banner not found");
  deleteFile("banners", banner.image);
  res.status(200).json(new ApiResponse(200, null, "Banner deleted successfully"));
});
