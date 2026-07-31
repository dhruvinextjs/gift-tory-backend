const HomeInfo = require("../../models/HomeInfo");

exports.getHomeInfo = async (req, res) => {

    const data = await HomeInfo.findOne();

    res.status(200).json({
        success: true,
        data
    });

};