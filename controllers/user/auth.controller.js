const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const bcrypt = require("bcryptjs");
const Otp = require("../../models/OtpModel");
const generateReferralCode = require("../../utils/generateReferralCode");

const generateOtp = require("../../utils/generateOtp");
const sendOtp = require("../../utils/sendOtp");
const generateToken = require("../../utils/generateToken");
const jwt = require("../../utils/generateToken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register a new user
// @route   POST /api/user/auth/register
exports.requestOtp = async (req, res) => {
  try {
    const { phone, password, referralCode } = req.body;

    // Phone Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Password Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Phone Format Validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // Existing User Check
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Remove old OTP if exists
    await Otp.deleteMany({ phone });

    // Save OTP
    await Otp.create({
      phone,
      password: hashedPassword,
      referralCode,
      otp,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP (Console)
    await sendOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const otpData = await Otp.findOne({
      phone,
      purpose: "signup",
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const referralCode = await generateReferralCode();

    const user = await User.create({
      phone: otpData.phone,

      password: otpData.password,

      isVerified: true,

      referralCode,
    });

    await Otp.deleteOne({ _id: otpData._id });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,

      message: "Signup successful",

      token,

      data: {
        id: user._id,

        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,

        message: "Phone number is required",
      });
    }

    const otpData = await Otp.findOne({
      phone,
      purpose: "signup",
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,

        message: "Request OTP first",
      });
    }

    const otp = generateOtp();

    otpData.otp = otp;

    otpData.expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpData.save();

    await sendOtp(phone, otp);

    return res.status(200).json({
      success: true,

      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.forgotPasswordRequestOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({
      phone,
      purpose: "forgot-password",
    });

    await Otp.create({
      phone,
      password: user.password,
      otp,
      purpose: "forgot-password",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const otpData = await Otp.findOne({
      phone,
      purpose: "forgot-password",
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, password, confirmPassword } = req.body;

    if (!phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const otpData = await Otp.findOne({
      phone,
      purpose: "forgot-password",
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    const user = await User.findOne({ phone });

    user.password = password;

    await user.save();

    await Otp.deleteOne({
      _id: otpData._id,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.forgotPasswordResendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const otpData = await Otp.findOne({
      phone,
      purpose: "forgot-password",
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "Request OTP first",
      });
    }

    const otp = generateOtp();

    otpData.otp = otp;

    otpData.expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpData.save();

    await sendOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Logout user
// @route   POST /api/user/auth/logout
exports.logout = catchAsync(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc    Get logged-in user's profile
// @route   GET /api/user/auth/me
exports.getProfile = catchAsync(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

// @desc    Update profile (name, phone, avatar)
// @route   PUT /api/user/auth/me
exports.updateProfile = catchAsync(async (req, res) => {
  const { name, phone } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (req.file) updates.avatar = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

// @desc    Change password
// @route   PUT /api/user/auth/change-password
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

// @desc    Add a new address
// @route   POST /api/user/auth/address
exports.addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(new ApiResponse(201, user.addresses, "Address added"));
});

// @desc    Update an address
// @route   PUT /api/user/auth/address/:addressId
exports.updateAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, "Address not found");

  Object.assign(address, req.body);
  await user.save();
  res.status(200).json(new ApiResponse(200, user.addresses, "Address updated"));
});

// @desc    Delete an address
// @route   DELETE /api/user/auth/address/:addressId
exports.deleteAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.status(200).json(new ApiResponse(200, user.addresses, "Address removed"));
});
