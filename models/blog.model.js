const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    coverImage: { type: String, required: true },
    author: { type: String, default: "Gifttory Team" },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-5)}`;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
