const Address = require("../../models/address.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

// =============================
// Add New Address
// POST /api/user/address
// =============================
exports.addAddress = catchAsync(async (req, res) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    country,
    addressType,
    latitude,
    longitude,
  } = req.body;

  // Validation

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    throw new ApiError(400, "Please fill all required fields.");
  }

  // Phone Validation

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number.");
  }

  // Pincode Validation

  if (!/^\d{6}$/.test(pincode)) {
    throw new ApiError(400, "Invalid pincode.");
  }

  // Check if first address

  const totalAddress = await Address.countDocuments({
    user: req.user._id,
  });

  const address = await Address.create({
    user: req.user._id,

    fullName,

    phone,

    addressLine1,

    addressLine2,

    landmark,

    city,

    state,

    pincode,

    country,

    addressType,

    latitude,

    longitude,

    isDefault: totalAddress === 0,
  });

  res.status(201).json(
    new ApiResponse(
      201,

      address,

      "Address added successfully",
    ),
  );
});

// ======================================
// Get All Addresses
// GET /api/user/address
// ======================================

exports.getAllAddresses = catchAsync(async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json(
    new ApiResponse(
      200,

      addresses,

      "Addresses fetched successfully",
    ),
  );
});

exports.updateAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  Object.assign(address, req.body);

  await address.save();

  res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});

// ======================================
// Delete Address
// DELETE /api/user/address/:id
// ======================================

exports.deleteAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Agar deleted address default tha,
  // to baki address me se ek ko default bana do

  if (address.isDefault) {
    const anotherAddress = await Address.findOne({
      user: req.user._id,
      _id: { $ne: address._id },
    }).sort({ createdAt: 1 });

    if (anotherAddress) {
      anotherAddress.isDefault = true;

      await anotherAddress.save();
    }
  }

  await address.deleteOne();

  res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Address deleted successfully",
    ),
  );
});

// ======================================
// Set Default Address
// PUT /api/user/address/:id/default
// ======================================

exports.setDefaultAddress = catchAsync(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Remove old default
  await Address.updateMany(
    {
      user: req.user._id,
    },
    {
      isDefault: false,
    },
  );

  // Make selected address default
  address.isDefault = true;

  await address.save();

  res.status(200).json(
    new ApiResponse(
      200,

      address,

      "Default address updated successfully",
    ),
  );
});
