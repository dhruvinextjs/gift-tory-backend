const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const Coupon = require("../../models/coupon.model");
const calculateCartSummary = require("../../utils/cartSummary");

const getOrCreateCart = async (userId, guestId) => {
  let cart;

  if (userId) {
    cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }
  } else {
    cart = await Cart.findOne({
      guestId,
    });

    if (!cart) {
      cart = await Cart.create({
        guestId,
        items: [],
      });
    }
  }

  return cart;
};

// @desc    Get logged-in user's cart
// @route   GET /api/user/cart
exports.getCart = catchAsync(async (req, res) => {

    let cart;

    if (req.user) {

        cart = await Cart.findOne({
            user: req.user._id
        });

    } else {

        cart = await Cart.findOne({
            guestId: req.headers["x-guest-id"]
        });

    }

    if (cart) {

        await cart.populate(
            "items.product",
            "name images price discountPrice stock slug"
        );

    }

    res.status(200).json(
        new ApiResponse(
            200,
            cart || { items: [] },
            "Cart fetched successfully"
        )
    );

});

// @desc    Add item to cart
// @route   POST /api/user/cart
// body: { productId, quantity }
exports.addToCart = catchAsync(async (req, res) => {
  const guestId = req.headers["x-guest-id"];
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

const userId = req.user ? req.user._id : null;

const cart = await getOrCreateCart(userId, guestId);
  const price = product.discountPrice || product.price;

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );
  if (existingItem) {
    existingItem.quantity += Number(quantity);
    existingItem.price = price;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();
  await cart.populate(
    "items.product",
    "name images price discountPrice stock slug",
  );

  res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// @desc    Update quantity of a cart item
// @route   PUT /api/user/cart/:itemId
exports.updateCartItem = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1)
    throw new ApiError(400, "Quantity must be at least 1");

let cart;

if(req.user){

    cart = await Cart.findOne({

        user:req.user._id

    });

}else{

    cart = await Cart.findOne({

        guestId:req.headers["x-guest-id"]

    });

}
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, "Cart item not found");

  item.quantity = quantity;
  await cart.save();
  await cart.populate(
    "items.product",
    "name images price discountPrice stock slug",
  );

  res.status(200).json(new ApiResponse(200, cart, "Cart item updated"));
});

// @desc    Remove item from cart
// @route   DELETE /api/user/cart/:itemId
exports.removeCartItem = catchAsync(async (req, res) => {
let cart;

if(req.user){

    cart = await Cart.findOne({
        user:req.user._id
    });

}else{

    cart = await Cart.findOne({
        guestId:req.headers["x-guest-id"]
    });

}
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items.pull(req.params.itemId);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

// @desc    Clear entire cart
// @route   DELETE /api/user/cart
exports.clearCart = catchAsync(async (req, res) => {
let cart;

if(req.user){

    cart = await Cart.findOne({
        user:req.user._id
    });

}else{

    cart = await Cart.findOne({
        guestId:req.headers["x-guest-id"]
    });

}
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});


// @desc Apply Coupon
// @route POST /api/user/cart/apply-coupon

exports.applyCoupon = catchAsync(async (req, res) => {

    const { couponCode } = req.body;

    if (!couponCode) {
        throw new ApiError(400, "Coupon code is required");
    }

    //---------------------------------------
    // Find Cart
    //---------------------------------------

    let cart;

    if (req.user) {

        cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

    } else {

        const guestId = req.headers["x-guest-id"];

        if (!guestId) {
            throw new ApiError(400, "Guest Id is required");
        }

        cart = await Cart.findOne({
            guestId
        }).populate("items.product");

    }

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    //---------------------------------------
    // Find Coupon
    //---------------------------------------

    const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true
    });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon");
    }

    //---------------------------------------
    // Expiry Check
    //---------------------------------------

    if (coupon.expiryDate < new Date()) {
        throw new ApiError(400, "Coupon expired");
    }

    //---------------------------------------
    // Usage Limit
    //---------------------------------------

    if (coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(400, "Coupon usage limit exceeded");
    }

    //---------------------------------------
    // Save Coupon in Cart
    //---------------------------------------

    cart.couponCode = coupon.code;

    await cart.save();

    //---------------------------------------
    // Calculate Summary
    //---------------------------------------

    const summary = await calculateCartSummary(cart);

    cart.couponDiscount = summary.couponDiscount;

    await cart.save();

    res.status(200).json(

        new ApiResponse(

            200,

            summary,

            "Coupon applied successfully"

        )

    );

});


// @desc Remove Coupon
// @route DELETE /api/user/cart/remove-coupon

exports.removeCoupon = catchAsync(async (req, res) => {

    let cart;

    if (req.user) {

        cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

    } else {

        const guestId = req.headers["x-guest-id"];

        if (!guestId) {
            throw new ApiError(400, "Guest Id is required");
        }

        cart = await Cart.findOne({
            guestId
        }).populate("items.product");

    }

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.couponCode = "";
    cart.couponDiscount = 0;

    await cart.save();

    const summary = await calculateCartSummary(cart);

    res.status(200).json(
        new ApiResponse(
            200,
            summary,
            "Coupon removed successfully"
        )
    );

});

// @desc Get Cart Summary
// @route GET /api/user/cart/summary

exports.getCartSummary = catchAsync(async (req, res) => {

    let cart;

    if (req.user) {

        cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

    } else {

        const guestId = req.headers["x-guest-id"];

        if (!guestId) {
            throw new ApiError(400, "Guest Id is required");
        }

        cart = await Cart.findOne({
            guestId
        }).populate("items.product");

    }

    if (!cart) {

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalItems: 0,
                    mrpTotal: 0,
                    productDiscount: 0,
                    couponDiscount: 0,
                    deliveryCharge: 0,
                    grandTotal: 0,
                    couponCode: "",
                    freeDelivery: false
                },
                "Cart is empty"
            )
        );

    }

    const summary = await calculateCartSummary(cart);

    res.status(200).json(

        new ApiResponse(

            200,

            summary,

            "Cart summary fetched successfully"

        )

    );

});