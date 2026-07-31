const sendOtp = async (phone, otp) => {
  console.log("\n==============================");
  console.log("OTP SENT SUCCESSFULLY");
  console.log("Phone :", phone);
  console.log("OTP   :", otp);
  console.log("==============================\n");

  return true;
};

module.exports = sendOtp;