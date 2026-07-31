const Video = require("../../models/Video");


// =========================
// List Page
// =========================
exports.getVideos = async (req, res) => {

    const videos = await Video.find().sort({ createdAt: -1 });

    res.render("admin/videos/index", {
        title: "Videos",
        active: "videos",
        videos
    });

};


// =========================
// Add Video
// =========================
exports.createVideo = async (req, res) => {

    const {
        title,
        userName
    } = req.body;

    let thumbnail = "";
    let video = "";

    if (req.files.thumbnail) {
        thumbnail =
            "/uploads/videos/" +
            req.files.thumbnail[0].filename;
    }

    if (req.files.video) {
        video =
            "/uploads/videos/" +
            req.files.video[0].filename;
    }

    await Video.create({
        title,
         creatorName: userName,

    creatorImage: thumbnail,
        video
    });

    req.flash("success", "Video Added Successfully");

    res.redirect("/admin/videos");

};


// =========================
// Delete Video
// =========================
exports.deleteVideo = async (req, res) => {

    await Video.findByIdAndDelete(req.params.id);

    req.flash("success", "Video Deleted Successfully");

    res.redirect("/admin/videos");

};