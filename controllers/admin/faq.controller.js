const Faq = require("../../models/faq.model");



exports.listFaqs = async (req, res) => {

  try {

    const faqs = await Faq.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.render("admin/faqs/index", {
    title: "FAQs",
    active: "faqs",
    faqs,
});

  } catch (error) {

    console.log(error);

    req.flash("error", "Unable to fetch FAQs");

    res.redirect("/admin");

  }

};




exports.addFaqPage = (req, res) => {

res.render("admin/faqs/add", {
    title: "Add FAQ",
    active: "faqs",
});

};




exports.addFaq = async (req, res) => {

  try {

    const {
      question,
      answer,
      order,
      isActive,
    } = req.body;

    await Faq.create({

      question,

      answer,

      order: order || 0,

      isActive: isActive === "on",

    });

    req.flash("success", "FAQ added successfully.");

    res.redirect("/admin/faqs");

  } catch (error) {

    console.log(error);

    req.flash("error", "Unable to add FAQ.");

    res.redirect("/admin/faqs/add");

  }

};





exports.editFaqPage = async (req, res) => {

  try {

    const faq = await Faq.findById(req.params.id);

    if (!faq) {

      req.flash("error", "FAQ not found");

      return res.redirect("/admin/faqs");

    }

    res.render("admin/faqs/edit", {
    title: "Edit FAQ",
    active: "faqs",
    faq,
});

  } catch (error) {

    console.log(error);

    req.flash("error", "Something went wrong");

    res.redirect("/admin/faqs");

  }

};






exports.updateFaq = async (req, res) => {

  try {

    const {

      question,

      answer,

      order,

      isActive,

    } = req.body;

    await Faq.findByIdAndUpdate(

      req.params.id,

      {

        question,

        answer,

        order,

        isActive: isActive === "on",

      }

    );

    req.flash("success", "FAQ updated successfully.");

    res.redirect("/admin/faqs");

  } catch (error) {

    console.log(error);

    req.flash("error", "Unable to update FAQ.");

    res.redirect("/admin/faqs");

  }

};






exports.deleteFaq = async (req, res) => {

  try {

    await Faq.findByIdAndDelete(req.params.id);

    req.flash("success", "FAQ deleted successfully.");

    res.redirect("/admin/faqs");

  } catch (error) {

    console.log(error);

    req.flash("error", "Unable to delete FAQ.");

    res.redirect("/admin/faqs");

  }

};