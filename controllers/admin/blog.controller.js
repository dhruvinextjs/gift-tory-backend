const fs = require("fs");
const path = require("path");
const Blog = require("../../models/blog.model");
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

exports.renderBlogList = catchAsync(async (req, res) => {
  const blogs = await Blog.find().sort("-createdAt");
  res.render("admin/blogs/list", { title: "Blogs", active: "blogs", blogs });
});

exports.renderAddBlogForm = (req, res) => {
  res.render("admin/blogs/add", { title: "Add Blog", active: "blogs" });
};

exports.createBlogPanel = catchAsync(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Cover image is required");
    return res.redirect("/admin/blogs/add");
  }
  await Blog.create({
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt,
    author: req.body.author || "Gifttory Team",
    tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],
    coverImage: req.file.filename,
    isPublished: req.body.isPublished === "on",
  });
  req.flash("success", "Blog created successfully");
  res.redirect("/admin/blogs");
});

exports.renderEditBlogForm = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    req.flash("error", "Blog not found");
    return res.redirect("/admin/blogs");
  }
  res.render("admin/blogs/edit", { title: "Edit Blog", active: "blogs", blog });
});

exports.updateBlogPanel = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    req.flash("error", "Blog not found");
    return res.redirect("/admin/blogs");
  }
  blog.title = req.body.title;
  blog.content = req.body.content;
  blog.excerpt = req.body.excerpt;
  blog.author = req.body.author || "Gifttory Team";
  blog.tags = req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [];
  blog.isPublished = req.body.isPublished === "on";

  if (req.file) {
    deleteFile("blogs", blog.coverImage);
    blog.coverImage = req.file.filename;
  }

  await blog.save();
  req.flash("success", "Blog updated successfully");
  res.redirect("/admin/blogs");
});

exports.deleteBlogPanel = catchAsync(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (blog) deleteFile("blogs", blog.coverImage);
  req.flash("success", "Blog deleted successfully");
  res.redirect("/admin/blogs");
});

// ============ ADMIN API ============

exports.getAllBlogsApi = catchAsync(async (req, res) => {
  const blogs = await Blog.find().sort("-createdAt");
  res.status(200).json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

exports.createBlogApi = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Cover image is required");
  const body = { ...req.body };
  if (body.tags) body.tags = body.tags.split(",").map((t) => t.trim());

  const blog = await Blog.create({ ...body, coverImage: req.file.filename });
  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

exports.updateBlogApi = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  const body = { ...req.body };
  if (body.tags) body.tags = body.tags.split(",").map((t) => t.trim());
  Object.assign(blog, body);

  if (req.file) {
    deleteFile("blogs", blog.coverImage);
    blog.coverImage = req.file.filename;
  }
  await blog.save();
  res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

exports.deleteBlogApi = catchAsync(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  deleteFile("blogs", blog.coverImage);
  res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});
