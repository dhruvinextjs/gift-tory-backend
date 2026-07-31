const Banner = require("../../models/banner.model");

exports.getBanners = async (req, res) => {

    const banners = await Banner.find({
        isActive: true
    }).sort({
        displayOrder: 1
    });

    res.status(200).json({
        success: true,
        count: banners.length,
        data: banners
    });

};