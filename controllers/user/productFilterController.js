const Product = require("../../models/product.model");

const filterProducts = async (req, res) => {
  try {
    const {
      category,
      occasion,
      minPrice,
      maxPrice,
      sameDayDelivery,
      giftType,
      theme,
      availability,
      sort,
    } = req.query;

    // -----------------------------------
    // Base filter
    // -----------------------------------
    const filter = {
      isActive: true,
    };

    // -----------------------------------
    // Category filter
    // -----------------------------------
    if (category) {
      const categoryIds = category.split(",").filter(Boolean);

      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
      }
    }

    // -----------------------------------
    // Occasion filter
    // -----------------------------------
    if (occasion) {
      const occasionIds = occasion.split(",").filter(Boolean);

      if (occasionIds.length > 0) {
        filter.occasion = { $in: occasionIds };
      }
    }

    // -----------------------------------
    // Price filter
    // -----------------------------------
    if (minPrice || maxPrice) {
      filter.$or = [
        {
          discountPrice: {
            ...(minPrice ? { $gte: Number(minPrice) } : {}),
            ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
          },
        },
        {
          discountPrice: { $exists: false },
          price: {
            ...(minPrice ? { $gte: Number(minPrice) } : {}),
            ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
          },
        },
      ];
    }

    // -----------------------------------
    // Same Day Delivery
    // -----------------------------------
    if (sameDayDelivery === "true") {
      filter.isSameDayDelivery = true;
    }

    // -----------------------------------
    // Gift Type
    // -----------------------------------
    if (giftType) {
      const giftTypes = giftType
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (giftTypes.length > 0) {
        filter.tags = { $in: giftTypes };
      }
    }

    // -----------------------------------
    // Theme
    // -----------------------------------
    if (theme) {
      const themes = theme
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (themes.length > 0) {
        filter.tags = {
          ...(filter.tags || {}),
          $in: themes,
        };
      }
    }

    // -----------------------------------
    // Availability
    // -----------------------------------
    if (availability === "in-stock") {
      filter.stock = { $gt: 0 };
    }

    if (availability === "out-of-stock") {
      filter.stock = { $lte: 0 };
    }

    // -----------------------------------
    // Sorting
    // -----------------------------------
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price-low") {
      sortOption = {
        discountPrice: 1,
        price: 1,
      };
    }

    if (sort === "price-high") {
      sortOption = {
        discountPrice: -1,
        price: -1,
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        ratingsAverage: -1,
      };
    }

    // -----------------------------------
    // Get products
    // -----------------------------------
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("occasion", "name slug")
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Filter products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to filter products",
      error: error.message,
    });
  }
};

module.exports = {
  filterProducts,
};