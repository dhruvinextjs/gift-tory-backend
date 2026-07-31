require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const Occasion = require("../models/occasion.model");
const Testimonial = require("../models/testimonial.model");

const seed = async () => {
  await connectDB();

  // ---------------- Admin ----------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gifttory.com";
  const existingAdmin = await Admin.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Gifttory Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "Admin@123",
      role: "superadmin",
    });
    console.log(`✅ Default admin created -> ${adminEmail} / ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
  }

  // ---------------- Sample Categories ----------------
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany([
      { name: "Personalized Gifts", image: "placeholder-category.png", displayOrder: 1 },
      { name: "Flowers & Bouquets", image: "placeholder-category.png", displayOrder: 2 },
      { name: "Cakes", image: "placeholder-category.png", displayOrder: 3 },
      { name: "Corporate Gifts", image: "placeholder-category.png", displayOrder: 4 },
      { name: "Home Decor", image: "placeholder-category.png", displayOrder: 5 },
      { name: "Jewellery", image: "placeholder-category.png", displayOrder: 6 },
    ]);
    console.log("✅ Sample categories created");
  } else {
    console.log("ℹ️  Categories already exist, skipping.");
  }

  // ---------------- Sample Occasions ----------------
  const occasionCount = await Occasion.countDocuments();
  if (occasionCount === 0) {
    await Occasion.insertMany([
      { name: "Birthday", image: "placeholder-occasion.png", displayOrder: 1 },
      { name: "Anniversary", image: "placeholder-occasion.png", displayOrder: 2 },
      { name: "Wedding", image: "placeholder-occasion.png", displayOrder: 3 },
      { name: "Valentine's Day", image: "placeholder-occasion.png", displayOrder: 4 },
    ]);
    console.log("✅ Sample occasions created");
  } else {
    console.log("ℹ️  Occasions already exist, skipping.");
  }

  // ---------------- Sample Testimonials ----------------
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        name: "Priya Sharma",
        designation: "Happy Customer",
        message: "Loved the personalized gift, delivered right on time!",
        rating: 5,
        displayOrder: 1,
      },
      {
        name: "Rahul Mehta",
        designation: "Corporate Client",
        message: "Great experience ordering bulk corporate gifts for our team.",
        rating: 5,
        displayOrder: 2,
      },
    ]);
    console.log("✅ Sample testimonials created");
  } else {
    console.log("ℹ️  Testimonials already exist, skipping.");
  }

  console.log("🎉 Seeding complete!");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
