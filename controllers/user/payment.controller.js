const Address = require("../../models/address.model");
const Personalization = require("../../models/personalization.model");
const Cart = require("../../models/cart.model");
const calculateCartSummary = require("../../utils/cartSummary");

const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

exports.getPaymentSummary = catchAsync(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const summary = await calculateCartSummary(cart);

    const address = await Address.findOne({
        user: req.user._id,
        isDefault: true
    });

    const personalization = await Personalization.findOne({
        cart: cart._id
    });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                address,

                senderDetail: personalization
                    ? {
                          senderName: personalization.senderName,
                          senderPhone: personalization.senderPhone,
                          keepSurprise: personalization.keepSurprise
                      }
                    : null,

                orderSummary: summary,

                paymentMethods: [
                    "CARD",
                    "COD",
                    "WALLET",
                    "QR"
                ]
            },
            "Payment summary fetched successfully"
        )
    );
});