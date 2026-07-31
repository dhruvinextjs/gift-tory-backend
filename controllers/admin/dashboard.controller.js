const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Category = require("../../models/category.model");
const Contact = require("../../models/contact.model");
const BulkOrder = require("../../models/bulkOrder.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

const buildStats = async () => {
  const [totalUsers, totalProducts, totalOrders, totalCategories, pendingContacts, pendingBulkOrders, orders] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Contact.countDocuments({ status: "new" }),
      BulkOrder.countDocuments({ status: "new" }),
      Order.find().sort("-createdAt").limit(5).populate("user", "name email"),
    ]);

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const orderStatusAgg = await Order.aggregate([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
    .select("name stock images")
    .limit(5);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalCategories,
    totalRevenue,
    pendingContacts,
    pendingBulkOrders,
    recentOrders: orders,
    orderStatusAgg,
    lowStockProducts,
  };
};

// @desc    Render admin dashboard page
// @route   GET /admin/dashboard
exports.renderDashboard = catchAsync(async (req, res) => {
  const stats = await buildStats();
  res.render("admin/dashboard", {
    title: "Dashboard",
    active: "dashboard",
    stats,
  });
});

// @desc    Get dashboard stats via API
// @route   GET /api/admin/dashboard/stats
exports.getStats = catchAsync(async (req, res) => {
  const stats = await buildStats();
  res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});
