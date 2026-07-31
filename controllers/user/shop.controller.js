const Shop = require("../../models/shop.model");

// ==============================
// Get All Active Shops
// ==============================
exports.getShops = async (req, res) => {

    const shops = await Shop.find({
        isActive: true
    }).sort({
        displayOrder: 1
    });

    res.status(200).json({
        success: true,
        count: shops.length,
        data: shops
    });

};