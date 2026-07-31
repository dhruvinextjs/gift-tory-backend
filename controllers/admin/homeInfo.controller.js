const HomeInfo = require("../../models/HomeInfo");

exports.getHomeInfo = async (req, res) => {

    let data = await HomeInfo.findOne();

    if (!data) {
        data = await HomeInfo.create({});
    }

    res.render("admin/home-info/index", {
        title: "Home Information",
        active: "home-info",
        data
    });

};

exports.saveHomeInfo = async (req, res) => {

    let data = await HomeInfo.findOne();

    if (!data) {
        data = await HomeInfo.create({});
    }

    for (let i = 0; i < 3; i++) {

        data.infos[i].value = req.body[`value${i}`];

        data.infos[i].title = req.body[`title${i}`];

    }

    await data.save();

    req.flash("success", "Information Updated Successfully");

    res.redirect("/admin/home-info");

};