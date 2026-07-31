const fs = require("fs");
const path = require("path");
const Category = require("../../models/category.model");
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

exports.renderCategoryList = catchAsync(async (req, res) => {
  const categories = await Category.find().sort("displayOrder");
  res.render("admin/categories/list", { title: "Categories", active: "categories", categories });
});

exports.renderAddCategoryForm = (req, res) => {
  res.render("admin/categories/add", { title: "Add Category", active: "categories" });
};

exports.createCategoryPanel = catchAsync(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Category image is required");
    return res.redirect("/admin/categories/add");
  }
  await Category.create({
    name: req.body.name,
    description: req.body.description,
    image: req.file.filename,
    displayOrder: req.body.displayOrder || 0,
    isActive: req.body.isActive === "on",
  });
  req.flash("success", "Category created successfully");
  res.redirect("/admin/categories");
});

exports.renderEditCategoryForm = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    req.flash("error", "Category not found");
    return res.redirect("/admin/categories");
  }
  res.render("admin/categories/edit", { title: "Edit Category", active: "categories", category });
});

exports.updateCategoryPanel = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    req.flash("error", "Category not found");
    return res.redirect("/admin/categories");
  }
  category.name = req.body.name;
  category.description = req.body.description;
  category.displayOrder = req.body.displayOrder || 0;
  category.isActive = req.body.isActive === "on";

  if (req.file) {
    deleteFile("categories", category.image);
    category.image = req.file.filename;
  }

  await category.save();
  req.flash("success", "Category updated successfully");
  res.redirect("/admin/categories");
});

exports.deleteCategoryPanel = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category) deleteFile("categories", category.image);
  req.flash("success", "Category deleted successfully");
  res.redirect("/admin/categories");
});

// ============ ADMIN API ============

exports.getAllCategoriesApi = catchAsync(async (req, res) => {
  const categories = await Category.find().sort("displayOrder");
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

exports.getCategoryByIdApi = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

exports.createCategoryApi = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Category image is required");
  const category = await Category.create({
    ...req.body,
    image: req.file.filename,
  });
  res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

exports.updateCategoryApi = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  Object.assign(category, req.body);
  if (req.file) {
    deleteFile("categories", category.image);
    category.image = req.file.filename;
  }
  await category.save();
  res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

exports.deleteCategoryApi = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  deleteFile("categories", category.image);
  res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});
