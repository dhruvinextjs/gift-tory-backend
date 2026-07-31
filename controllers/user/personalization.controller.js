const Personalization = require("../../models/personalization.model");
const Cart = require("../../models/cart.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const getCart = async (req) => {
  if (req.user) {
    return await Cart.findOne({
      user: req.user._id,
    });
  }

  const guestId = req.headers["x-guest-id"];

  if (!guestId) {
    throw new ApiError(400, "Guest Id is required");
  }

  return await Cart.findOne({
    guestId,
  });
};

// POST /api/user/personalization
exports.savePersonalization = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const data = {
    deliveryDate: req.body.deliveryDate,
    occasion: req.body.occasion,
    message: req.body.message,
    senderName: req.body.senderName,
    senderPhone: req.body.senderPhone,
    sameAsProfile: req.body.sameAsProfile,
      keepSurprise: req.body.keepSurprise
  };

  const personalization = await Personalization.findOneAndUpdate(
    {
      cart: cart._id,
    },

    {
      ...data,

      cart: cart._id,

      user: req.user ? req.user._id : null,

      guestId: req.user ? null : req.headers["x-guest-id"],
    },

    {
      new: true,

      upsert: true,

      runValidators: true,
    },
  );

  res.status(200).json(
    new ApiResponse(
      200,

      personalization,

      "Personalization saved successfully",
    ),
  );
});

// GET /api/user/personalization
exports.getPersonalization = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(
        200,

        null,

        "No personalization found",
      ),
    );
  }

  const personalization = await Personalization.findOne({
    cart: cart._id,
  });

  res.status(200).json(
    new ApiResponse(
      200,

      personalization,

      "Personalization fetched successfully",
    ),
  );
});

// DELETE /api/user/personalization
exports.deletePersonalization = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (cart) {
    await Personalization.deleteOne({
      cart: cart._id,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Personalization removed successfully",
    ),
  );
});

// @desc Update personalization
// @route PUT /api/user/personalization/:id

exports.updatePersonalization = catchAsync(async (req, res) => {
  const personalization = await Personalization.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!personalization) {
    throw new ApiError(404, "Personalization not found");
  }

  Object.assign(personalization, req.body);

  await personalization.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        personalization,
        "Personalization updated successfully",
      ),
    );
});
