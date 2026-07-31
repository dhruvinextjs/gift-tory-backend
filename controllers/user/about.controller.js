const AboutUs = require("../../models/AboutUs");

exports.getAboutPage = async (req, res) => {

    const about = await AboutUs.findOne();

    if (!about) {

        return res.status(200).json({
            success: true,
            data: null
        });

    }

    res.status(200).json({
        success: true,
        data: about
    });

};