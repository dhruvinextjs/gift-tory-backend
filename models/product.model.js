const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },

    price: { type: Number, required: true }, // MRP
    discountPrice: { type: Number }, // Selling price after discount

    images: [{ type: String }], // filenames stored in /uploads/products

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    occasion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Occasion" }],

    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },

    ratingsAverage: { type: Number, default: 4.5, min: 1, max: 5 },
    ratingsCount: { type: Number, default: 0 },

    tags: [{ type: String }],

    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isPersonalized: { type: Boolean, default: false },
    isCorporateGift: { type: Boolean, default: false },
    isSameDayDelivery: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-5)}`;
  }
  next();
});

// Virtual: discount percentage
productSchema.virtual("discountPercent").get(function () {
  if (!this.discountPrice || !this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
