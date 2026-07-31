const Blog = require("../../models/blog.model");
const ApiFeatures = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// @desc    Get all published blogs
// @route   GET /api/user/blog
exports.getAllBlogs = catchAsync(async (req, res) => {
  const baseQuery = Blog.find({ isPublished: true });
  const features = new ApiFeatures(baseQuery, req.query).search(["title", "content", "tags"]).sort().paginate();

  const blogs = await features.query;
  const total = await Blog.countDocuments({ isPublished: true });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          total,
          page: features.page,
          limit: features.limit,
          totalPages: Math.ceil(total / features.limit),
        },
      },
      "Blogs fetched successfully"
    )
  );
});

// @desc    Get single blog by slug
// @route   GET /api/user/blog/:slug
exports.getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});
