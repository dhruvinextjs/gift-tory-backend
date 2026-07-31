const AboutUs = require("../../models/AboutUs");

exports.getAboutUs = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    about = await AboutUs.create({});
  }

  res.render("admin/about-us/index", {
    title: "About Us",
    active: "about",
    about,
  });
};

exports.saveAboutUs = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    about = await AboutUs.create({});
  }

  // ===========================
  // Intro
  // ===========================

  about.introDescription = req.body.introDescription;

  // ===========================
  // Brand Story
  // ===========================

  about.brandHeading = req.body.brandHeading;
  about.brandSubHeading = req.body.brandSubHeading;
  about.brandDescription = req.body.brandDescription;

  // ===========================
  // Studio
  // ===========================

  about.studioHeading = req.body.studioHeading;
  about.studioSubHeading = req.body.studioSubHeading;
  about.studioDescription = req.body.studioDescription;

  // ===========================
  // Journey
  // ===========================

  about.journeyHeading = req.body.journeyHeading;

  // ===========================
  // Images
  // ===========================

  if (req.files["brandImage"]) {
    about.brandImage =
      "/uploads/about-us/" + req.files["brandImage"][0].filename;
  }

  if (req.files["studioImage1"]) {
    about.studioImage1 =
      "/uploads/about-us/" + req.files["studioImage1"][0].filename;
  }

  if (req.files["studioImage2"]) {
    about.studioImage2 =
      "/uploads/about-us/" + req.files["studioImage2"][0].filename;
  }

  if (req.files["studioImage3"]) {
    about.studioImage3 =
      "/uploads/about-us/" + req.files["studioImage3"][0].filename;
  }

 for (let i = 0; i < 4; i++) {

    about.journey[i].title =
        req.body[`journeyTitle${i}`];

    about.journey[i].description =
        req.body[`journeyDescription${i}`];

    if (req.files[`journeyIcon${i}`]) {

        about.journey[i].icon =
            "/uploads/about-us/" +
            req.files[`journeyIcon${i}`][0].filename;

    }

}

  await about.save();

  req.flash("success", "About Us Updated Successfully");

  res.redirect("/admin/about-us");
};
