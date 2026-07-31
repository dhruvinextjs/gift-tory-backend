const Video = require("../../models/Video");

exports.getVideos = async (req, res) => {

    const videos = await Video.find()
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: videos.length,
        data: videos
    });

};