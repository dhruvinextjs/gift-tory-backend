const ShippingPolicy = require("../../models/ShippingPolicy");

exports.getShippingPolicy = async (req, res) => {

    let policy = await ShippingPolicy.findOne();

    if (!policy) {

        policy = await ShippingPolicy.create({
            content: ""
        });

    }

    res.render(
        "admin/shipping-policy/index",
        {
            title: "Shipping Policy",
            active: "shipping-policy",
            policy
        }
    );

};

exports.saveShippingPolicy = async (req, res) => {

    const { content } = req.body;

    let policy = await ShippingPolicy.findOne();

    if (policy) {

        policy.content = content;

        await policy.save();

    } else {

        await ShippingPolicy.create({
            content
        });

    }

    req.flash(
        "success",
        "Shipping Policy Updated Successfully"
    );

    res.redirect("/admin/shipping-policy");

};