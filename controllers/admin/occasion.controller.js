const fs = require("fs");
const path = require("path");
const Occasion = require("../../models/occasion.model");
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

exports.renderOccasionList = catchAsync(async (req, res) => {
  const occasions = await Occasion.find().sort("displayOrder");
  res.render("admin/occasions/list", { title: "Occasions", active: "occasions", occasions });
});

exports.renderAddOccasionForm = (req, res) => {
  res.render("admin/occasions/add", { title: "Add Occasion", active: "occasions" });
};

exports.createOccasionPanel = catchAsync(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Occasion image is required");
    return res.redirect("/admin/occasions/add");
  }
  await Occasion.create({
    name: req.body.name,
    description: req.body.description,
    image: req.file.filename,
    displayOrder: req.body.displayOrder || 0,
    isActive: req.body.isActive === "on",
  });
  req.flash("success", "Occasion created successfully");
  res.redirect("/admin/occasions");
});

exports.renderEditOccasionForm = catchAsync(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);
  if (!occasion) {
    req.flash("error", "Occasion not found");
    return res.redirect("/admin/occasions");
  }
  res.render("admin/occasions/edit", { title: "Edit Occasion", active: "occasions", occasion });
});

exports.updateOccasionPanel = catchAsync(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);
  if (!occasion) {
    req.flash("error", "Occasion not found");
    return res.redirect("/admin/occasions");
  }
  occasion.name = req.body.name;
  occasion.description = req.body.description;
  occasion.displayOrder = req.body.displayOrder || 0;
  occasion.isActive = req.body.isActive === "on";

  if (req.file) {
    deleteFile("occasions", occasion.image);
    occasion.image = req.file.filename;
  }

  await occasion.save();
  req.flash("success", "Occasion updated successfully");
  res.redirect("/admin/occasions");
});

exports.deleteOccasionPanel = catchAsync(async (req, res) => {
  const occasion = await Occasion.findByIdAndDelete(req.params.id);
  if (occasion) deleteFile("occasions", occasion.image);
  req.flash("success", "Occasion deleted successfully");
  res.redirect("/admin/occasions");
});

// ============ ADMIN API ============

exports.getAllOccasionsApi = catchAsync(async (req, res) => {
  const occasions = await Occasion.find().sort("displayOrder");
  res.status(200).json(new ApiResponse(200, occasions, "Occasions fetched successfully"));
});

exports.getOccasionByIdApi = catchAsync(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);
  if (!occasion) throw new ApiError(404, "Occasion not found");
  res.status(200).json(new ApiResponse(200, occasion, "Occasion fetched successfully"));
});

exports.createOccasionApi = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Occasion image is required");
  const occasion = await Occasion.create({ ...req.body, image: req.file.filename });
  res.status(201).json(new ApiResponse(201, occasion, "Occasion created successfully"));
});

exports.updateOccasionApi = catchAsync(async (req, res) => {
  const occasion = await Occasion.findById(req.params.id);
  if (!occasion) throw new ApiError(404, "Occasion not found");

  Object.assign(occasion, req.body);
  if (req.file) {
    deleteFile("occasions", occasion.image);
    occasion.image = req.file.filename;
  }
  await occasion.save();
  res.status(200).json(new ApiResponse(200, occasion, "Occasion updated successfully"));
});

exports.deleteOccasionApi = catchAsync(async (req, res) => {
  const occasion = await Occasion.findByIdAndDelete(req.params.id);
  if (!occasion) throw new ApiError(404, "Occasion not found");
  deleteFile("occasions", occasion.image);
  res.status(200).json(new ApiResponse(200, null, "Occasion deleted successfully"));
});
