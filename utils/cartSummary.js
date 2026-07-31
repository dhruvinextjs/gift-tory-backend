const Coupon = require("../models/coupon.model");

const calculateCartSummary = async (cart) => {
  let mrpTotal = 0;
  let productDiscount = 0;
  let couponDiscount = 0;
  let deliveryCharge = 0;
  let totalItems = 0;

  for (const item of cart.items) {
    const product = item.product;

    const mrp = product.price;
    const sellingPrice =
      product.discountPrice && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    mrpTotal += mrp * item.quantity;

    productDiscount += (mrp - sellingPrice) * item.quantity;

    totalItems += item.quantity;
  }

  //--------------------------------------------------
  // Coupon Discount
  //--------------------------------------------------

  if (cart.couponCode) {
    const coupon = await Coupon.findOne({
      code: cart.couponCode,
      isActive: true,
    });

    if (coupon) {
      const amountAfterProductDiscount = mrpTotal - productDiscount;

      const today = new Date();

      if (
        coupon.expiryDate >= today &&
        coupon.usedCount < coupon.usageLimit &&
        amountAfterProductDiscount >= coupon.minOrderAmount
      ) {
        if (coupon.discountType === "flat") {
          couponDiscount = coupon.discountValue;
        } else {
          couponDiscount =
            (amountAfterProductDiscount * coupon.discountValue) / 100;

          if (
            coupon.maxDiscountAmount &&
            couponDiscount > coupon.maxDiscountAmount
          ) {
            couponDiscount = coupon.maxDiscountAmount;
          }
        }
      }
    }
  }

  //--------------------------------------------------
  // Delivery Charge
  //--------------------------------------------------

  const subtotal = mrpTotal - productDiscount - couponDiscount;

  if (subtotal >= 999) {
    deliveryCharge = 0;
  } else {
    deliveryCharge = 49;
  }

  //--------------------------------------------------
  // Grand Total
  //--------------------------------------------------

  const grandTotal = subtotal + deliveryCharge;

  return {
    totalItems,

    mrpTotal,

    productDiscount,

    couponDiscount,

    deliveryCharge,

    grandTotal,

    couponCode: cart.couponCode || "",

    freeDelivery: deliveryCharge === 0,
  };
};

module.exports = calculateCartSummary;
