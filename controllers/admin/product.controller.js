const fs = require("fs");
const path = require("path");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const Occasion = require("../../models/occasion.model");
const ApiFeatures = require("../../utils/apiFeatures");
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

const parseCheckbox = (val) => val === "on" || val === "true" || val === true;

// ============================
//   ADMIN PANEL (EJS views)
// ============================

// @desc    List all products (panel)
// @route   GET /admin/products
exports.renderProductList = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";

  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  const products = await Product.find(filter)
    .populate("category", "name")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.render("admin/products/list", {
    title: "Products",
    active: "products",
    products,
    search,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Render add product form
// @route   GET /admin/products/add
exports.renderAddProductForm = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  const occasions = await Occasion.find({ isActive: true });
  res.render("admin/products/add", {
    title: "Add Product",
    active: "products",
    categories,
    occasions,
  });
});

// @desc    Handle add product form submission
// @route   POST /admin/products/add
exports.createProductPanel = catchAsync(async (req, res) => {
  const images = (req.files || []).map((f) => f.filename);
  if (images.length === 0) {
    req.flash("error", "At least one product image is required");
    return res.redirect("/admin/products/add");
  }

  const body = req.body;
  await Product.create({
    name: body.name,
    description: body.description,
    shortDescription: body.shortDescription,
    price: body.price,
    discountPrice: body.discountPrice || undefined,
    images,
    category: body.category,
    occasion: body.occasion ? [].concat(body.occasion) : [],
    stock: body.stock,
    sku: body.sku || undefined,
    tags: body.tags ? body.tags.split(",").map((t) => t.trim()) : [],
    isTrending: parseCheckbox(body.isTrending),
    isFeatured: parseCheckbox(body.isFeatured),
    isBestSeller: parseCheckbox(body.isBestSeller),
    isNewArrival: parseCheckbox(body.isNewArrival),
    isPersonalized: parseCheckbox(body.isPersonalized),
    isCorporateGift: parseCheckbox(body.isCorporateGift),
    isSameDayDelivery: parseCheckbox(body.isSameDayDelivery),
  });

  req.flash("success", "Product created successfully");
  res.redirect("/admin/products");
});

// @desc    Render edit product form
// @route   GET /admin/products/edit/:id
exports.renderEditProductForm = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/admin/products");
  }
  const categories = await Category.find({ isActive: true });
  const occasions = await Occasion.find({ isActive: true });
  res.render("admin/products/edit", {
    title: "Edit Product",
    active: "products",
    product,
    categories,
    occasions,
  });
});

// @desc    Handle edit product form submission
// @route   POST /admin/products/edit/:id
exports.updateProductPanel = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/admin/products");
  }

  const body = req.body;
  const newImages = (req.files || []).map((f) => f.filename);

  product.name = body.name;
  product.description = body.description;
  product.shortDescription = body.shortDescription;
  product.price = body.price;
  product.discountPrice = body.discountPrice || undefined;
  product.category = body.category;
  product.occasion = body.occasion ? [].concat(body.occasion) : [];
  product.stock = body.stock;
  product.sku = body.sku || undefined;
  product.tags = body.tags ? body.tags.split(",").map((t) => t.trim()) : [];
  product.isTrending = parseCheckbox(body.isTrending);
  product.isFeatured = parseCheckbox(body.isFeatured);
  product.isBestSeller = parseCheckbox(body.isBestSeller);
  product.isNewArrival = parseCheckbox(body.isNewArrival);
  product.isPersonalized = parseCheckbox(body.isPersonalized);
  product.isCorporateGift = parseCheckbox(body.isCorporateGift);
  product.isSameDayDelivery = parseCheckbox(body.isSameDayDelivery);
  product.isActive = parseCheckbox(body.isActive);

  if (newImages.length > 0) {
    // remove old images from disk, replace with new ones
    product.images.forEach((img) => deleteFile("products", img));
    product.images = newImages;
  }

  await product.save();

  req.flash("success", "Product updated successfully");
  res.redirect("/admin/products");
});

// @desc    Delete product (panel)
// @route   POST /admin/products/delete/:id
exports.deleteProductPanel = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    product.images.forEach((img) => deleteFile("products", img));
  }
  req.flash("success", "Product deleted successfully");
  res.redirect("/admin/products");
});

// ============================
//   ADMIN REST API
// ============================

// @desc    Get all products (admin - includes inactive)
// @route   GET /api/admin/products
exports.getAllProductsApi = catchAsync(async (req, res) => {
  const baseQuery = Product.find().populate("category", "name").populate("occasion", "name");
  const features = new ApiFeatures(baseQuery, req.query).search(["name", "description"]).filter().sort().paginate();

  const products = await features.query;
  const total = await Product.countDocuments();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: { total, page: features.page, limit: features.limit, totalPages: Math.ceil(total / features.limit) },
      },
      "Products fetched successfully"
    )
  );
});

// @desc    Get single product by id
// @route   GET /api/admin/products/:id
exports.getProductByIdApi = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category").populate("occasion");
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// @desc    Create product via API
// @route   POST /api/admin/products
exports.createProductApi = catchAsync(async (req, res) => {
  const images = (req.files || []).map((f) => f.filename);
  const body = req.body;

  const product = await Product.create({
    ...body,
    images,
    occasion: body.occasion ? [].concat(body.occasion) : [],
    tags: body.tags ? body.tags.split(",").map((t) => t.trim()) : [],
  });

  res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

// @desc    Update product via API
// @route   PUT /api/admin/products/:id
exports.updateProductApi = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const newImages = (req.files || []).map((f) => f.filename);
  const body = { ...req.body };

  if (body.occasion) body.occasion = [].concat(body.occasion);
  if (body.tags) body.tags = body.tags.split(",").map((t) => t.trim());

  Object.assign(product, body);

  if (newImages.length > 0) {
    product.images.forEach((img) => deleteFile("products", img));
    product.images = newImages;
  }

  await product.save();
  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// @desc    Delete product via API
// @route   DELETE /api/admin/products/:id
exports.deleteProductApi = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  product.images.forEach((img) => deleteFile("products", img));

  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});
