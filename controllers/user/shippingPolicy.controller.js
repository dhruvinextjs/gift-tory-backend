const ShippingPolicy = require("../../models/ShippingPolicy");

exports.getShippingPolicy = async (req, res) => {
    try {

        const policy = await ShippingPolicy.findOne();

        return res.status(200).json({
            success: true,
            message: "Shipping Policy fetched successfully",
            data: policy
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};