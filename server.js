require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

// Route groups
const userRoutes = require("./routes/user");
const adminApiRoutes = require("./routes/admin");
const adminViewRoutes = require("./routes/admin/viewRoutes");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ---------------------------------------------------------
// Database
// ---------------------------------------------------------
connectDB();

// ---------------------------------------------------------
// View Engine (EJS + Layouts) - used by the Admin Panel
// ---------------------------------------------------------
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "admin/layout/main"); // default layout for admin panel

// ---------------------------------------------------------
// Core Middlewares
// ---------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session + Flash (needed for the Admin Panel login & alerts)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "gifttory_admin_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
  })
);
app.use(flash());

// Make flash messages & logged-in admin available to every EJS view
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.adminName = req.session.adminName || null;
  res.locals.adminRole = req.session.adminRole || null;
  next();
});

// ---------------------------------------------------------
// Routes
// ---------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Gifttory API is running 🎁" });
});

// User-facing REST API   -> /api/user/*
app.use("/api/user", userRoutes);

// Admin REST API (JWT)   -> /api/admin/*
app.use("/api/admin", adminApiRoutes);

// Admin Panel (EJS, session based) -> /admin/*
app.use("/admin", adminViewRoutes);

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Gifttory Backend API",
    docs: {
      userApi: "/api/user",
      adminApi: "/api/admin",
      adminPanel: "/admin/login",
    },
  });
});

// ---------------------------------------------------------
// Error Handling (must be last)
// ---------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------
// Start Server
// ---------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Gifttory server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`   Admin Panel:  http://localhost:${PORT}/admin/login`);
  console.log(`   User API:     http://localhost:${PORT}/api/user`);
  console.log(`   Admin API:    http://localhost:${PORT}/api/admin`);
});

module.exports = app;
