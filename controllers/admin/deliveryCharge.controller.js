const DeliveryCharge = require("../../models/deliveryCharge.model");
const catchAsync = require("../../utils/catchAsync");

// ================= LIST =================

exports.renderDeliveryChargeList = catchAsync(async (req, res) => {
  const deliveryCharges = await DeliveryCharge.find().sort({
    deliveryType: 1,
    timeSlot: 1,
  });

  res.render("admin/delivery-charges/list", {
    title: "Delivery Charges",
    active: "delivery-charges",
    deliveryCharges,
  });
});

// ================= CREATE PAGE =================

exports.renderAddDeliveryCharge = (req, res) => {
  res.render("admin/delivery-charges/create", {
    title: "Add Delivery Charge",
    active: "delivery-charges",
  });
};

// ================= CREATE =================

exports.createDeliveryCharge = catchAsync(async (req, res) => {
  const {
    deliveryType,
    timeSlot,
    deliveryCharge,
  } = req.body;

  await DeliveryCharge.create({
    deliveryType,
    timeSlot,
    deliveryCharge,
    isActive: req.body.isActive ? true : false,
  });

  req.flash("success", "Delivery Charge Added Successfully");

  res.redirect("/admin/delivery-charges");
});

// ================= EDIT PAGE =================

exports.renderEditDeliveryCharge = catchAsync(async (req, res) => {

  const delivery = await DeliveryCharge.findById(req.params.id);

  if (!delivery) {
    req.flash("error", "Delivery Charge Not Found");
    return res.redirect("/admin/delivery-charges");
  }

  res.render("admin/delivery-charges/edit", {
    title: "Edit Delivery Charge",
    active: "delivery-charges",
    delivery,
  });

});

// ================= UPDATE =================

exports.updateDeliveryCharge = catchAsync(async (req, res) => {

  const {
    deliveryType,
    timeSlot,
    deliveryCharge,
  } = req.body;

  await DeliveryCharge.findByIdAndUpdate(req.params.id, {
    deliveryType,
    timeSlot,
    deliveryCharge,
    isActive: req.body.isActive ? true : false,
  });

  req.flash("success", "Updated Successfully");

  res.redirect("/admin/delivery-charges");

});

// ================= DELETE =================

exports.deleteDeliveryCharge = catchAsync(async (req, res) => {

  await DeliveryCharge.findByIdAndDelete(req.params.id);

  req.flash("success", "Deleted Successfully");

  res.redirect("/admin/delivery-charges");

});



// ================= API LIST =================

exports.getAllDeliveryCharges = catchAsync(async (req, res) => {
  const data = await DeliveryCharge.find().sort({
    deliveryType: 1,
    timeSlot: 1,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// ================= API CREATE =================

exports.createDeliveryChargeApi = catchAsync(async (req, res) => {
  const delivery = await DeliveryCharge.create(req.body);

  res.status(201).json({
    success: true,
    data: delivery,
  });
});

// ================= API UPDATE =================

exports.updateDeliveryChargeApi = catchAsync(async (req, res) => {
  const delivery = await DeliveryCharge.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: delivery,
  });
});

// ================= API DELETE =================

exports.deleteDeliveryChargeApi = catchAsync(async (req, res) => {
  await DeliveryCharge.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
});