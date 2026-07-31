const Shop = require("../../models/shop.model");

// ==========================
// List Page
// ==========================
exports.getShops = async (req, res) => {

    const shops = await Shop.find().sort({
        displayOrder: 1
    });

    res.render("admin/shops/index", {
        title: "Shops",
        active: "shops",
        shops
    });

};

// ==========================
// Add Shop
// ==========================
exports.createShop = async (req, res) => {

    const images = [];

    if (req.files && req.files.length > 0) {

        req.files.forEach(file => {

            images.push(
                "/uploads/shops/" + file.filename
            );

        });

    }

    await Shop.create({

        shopName: req.body.shopName,
        location: req.body.location,
        description: req.body.description,

        openDays: req.body.openDays,
        openingTime: req.body.openingTime,

        address: req.body.address,

        phone1: req.body.phone1,
        phone2: req.body.phone2,

        personalShopper1: req.body.personalShopper1,
        personalShopper2: req.body.personalShopper2,
        personalShopper3: req.body.personalShopper3,

        displayOrder: req.body.displayOrder || 0,

        images

    });

    req.flash(
        "success",
        "Shop Added Successfully"
    );

    res.redirect("/admin/shops");

};

// ==========================
// Delete Shop
// ==========================
exports.deleteShop = async (req, res) => {

    await Shop.findByIdAndDelete(
        req.params.id
    );

    req.flash(
        "success",
        "Shop Deleted Successfully"
    );

    res.redirect("/admin/shops");

};