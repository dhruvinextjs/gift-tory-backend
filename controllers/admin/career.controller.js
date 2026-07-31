const Career = require("../../models/career.model");
const catchAsync = require("../../utils/catchAsync");

// ==========================
// List Careers
// ==========================
exports.renderCareerList = catchAsync(async (req, res) => {

    const careers = await Career.find().sort({ createdAt: -1 });

    res.render("admin/careers/index", {
        layout: "admin/layout/main",
        title: "Careers",
        active: "careers",
        adminName: req.session?.admin?.name || "Admin",
        success: req.flash ? req.flash("success") : [],
        error: req.flash ? req.flash("error") : [],
        careers
    });

});

// ==========================
// Add Page
// ==========================
exports.renderAddCareer = (req, res) => {

    res.render("admin/careers/add", {
        layout: "admin/layout/main",
        title: "Add Career",
        active: "careers",
        adminName: req.session?.admin?.name || "Admin",
        success: req.flash ? req.flash("success") : [],
        error: req.flash ? req.flash("error") : []
    });

};

// ==========================
// Create Career
// ==========================
exports.createCareer = catchAsync(async (req, res) => {

    const {
    title,
        workMode,
        employmentType,
        description
    } = req.body;

    await Career.create({

        title,

        workMode,

        employmentType,

        description

    });

    req.flash("success", "Career added successfully.");

    res.redirect("/admin/careers");

});

// ==========================
// Edit Page
// ==========================
exports.renderEditCareer = catchAsync(async (req, res) => {

    const career = await Career.findById(req.params.id);

    if (!career) {
        req.flash("error", "Career not found.");
        return res.redirect("/admin/careers");
    }

    res.render("admin/careers/edit", {
        layout: "admin/layout/main",
        title: "Edit Career",
        active: "careers",
        adminName: req.session?.admin?.name || "Admin",
        success: req.flash ? req.flash("success") : [],
        error: req.flash ? req.flash("error") : [],
        career
    });

});

// ==========================
// Update Career
// ==========================
exports.updateCareer = catchAsync(async (req, res) => {

    const{

        title,

        workMode,

        employmentType,

        description

    }=req.body;

    await Career.findByIdAndUpdate(
        req.params.id,
           {

            title,

            workMode,

            employmentType,

            description

        }
    );

    req.flash("success", "Career updated successfully.");

    res.redirect("/admin/careers");

});

// ==========================
// Delete Career
// ==========================
exports.deleteCareer = catchAsync(async (req, res) => {

    await Career.findByIdAndDelete(req.params.id);

    req.flash("success", "Career deleted successfully.");

    res.redirect("/admin/careers");

});