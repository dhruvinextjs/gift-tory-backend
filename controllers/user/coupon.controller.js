const Coupon = require("../../models/coupon.model");

exports.getCoupons = async (req, res) => {

    const today = new Date();

    const coupons = await Coupon.find({
        isActive: true,
        expiryDate: {
            $gte: today
        }
    }).sort({
        createdAt: -1
    });

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });

};