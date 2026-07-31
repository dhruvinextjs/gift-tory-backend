const fs = require("fs");
const path = require("path");
const Testimonial = require("../../models/testimonial.model");
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

exports.renderTestimonialList = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find().sort("displayOrder");
  res.render("admin/testimonials/list", { title: "Testimonials", active: "testimonials", testimonials });
});

exports.renderAddTestimonialForm = (req, res) => {
  res.render("admin/testimonials/add", { title: "Add Testimonial", active: "testimonials" });
};

exports.createTestimonialPanel = catchAsync(async (req, res) => {
  await Testimonial.create({
    name: req.body.name,
    designation: req.body.designation,
    message: req.body.message,
    rating: req.body.rating || 5,
    image: req.file ? req.file.filename : "",
    displayOrder: req.body.displayOrder || 0,
    isActive: req.body.isActive === "on",
  });
  req.flash("success", "Testimonial created successfully");
  res.redirect("/admin/testimonials");
});

exports.renderEditTestimonialForm = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    req.flash("error", "Testimonial not found");
    return res.redirect("/admin/testimonials");
  }
  res.render("admin/testimonials/edit", { title: "Edit Testimonial", active: "testimonials", testimonial });
});

exports.updateTestimonialPanel = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    req.flash("error", "Testimonial not found");
    return res.redirect("/admin/testimonials");
  }
  testimonial.name = req.body.name;
  testimonial.designation = req.body.designation;
  testimonial.message = req.body.message;
  testimonial.rating = req.body.rating || 5;
  testimonial.displayOrder = req.body.displayOrder || 0;
  testimonial.isActive = req.body.isActive === "on";

  if (req.file) {
    deleteFile("testimonials", testimonial.image);
    testimonial.image = req.file.filename;
  }

  await testimonial.save();
  req.flash("success", "Testimonial updated successfully");
  res.redirect("/admin/testimonials");
});

exports.deleteTestimonialPanel = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (testimonial) deleteFile("testimonials", testimonial.image);
  req.flash("success", "Testimonial deleted successfully");
  res.redirect("/admin/testimonials");
});

// ============ ADMIN API ============

exports.getAllTestimonialsApi = catchAsync(async (req, res) => {
  const testimonials = await Testimonial.find().sort("displayOrder");
  res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});

exports.createTestimonialApi = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.create({
    ...req.body,
    image: req.file ? req.file.filename : "",
  });
  res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

exports.updateTestimonialApi = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  Object.assign(testimonial, req.body);
  if (req.file) {
    deleteFile("testimonials", testimonial.image);
    testimonial.image = req.file.filename;
  }
  await testimonial.save();
  res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

exports.deleteTestimonialApi = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  deleteFile("testimonials", testimonial.image);
  res.status(200).json(new ApiResponse(200, null, "Testimonial deleted successfully"));
});
