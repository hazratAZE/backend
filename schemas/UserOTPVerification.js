const mongoose = require("mongoose");

const UserOTPVerification = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("UserOPTVertification", UserOTPVerification);
