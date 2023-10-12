const { response } = require("express");
const User = require("../schemas/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserOTPVerification = require("../schemas/UserOTPVerification");
const nodemailer = require("nodemailer");
const user = require("../schemas/user");
var validator = require("email-validator");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const registerUser = async (request, response) => {
  const {
    name,
    surname,
    fatherName,
    email,
    phone,
    password,
    confirmPassword,
    agreement,
  } = request.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      response.status(419).json({
        error: true,
        message: "This email address is already registered",
      });
    }
    if (!name || !surname || !fatherName) {
      response.status(419).json({
        error: true,
        message: "Validation failed",
      });
    } else if (!agreement) {
      response.status(419).json({
        error: true,
        message: "Agreement section is required",
      });
    } else if (!validator.validate(email)) {
      response.status(419).json({
        error: true,
        message: "Please enter a valid email address",
      });
    } else if (!phone) {
      response.status(419).json({
        error: true,
        message: "Phone is required",
      });
    } else if (password.length < 6) {
      response.status(419).json({
        error: true,
        message: "Password must be at least 6 characters",
      });
    } else if (password !== confirmPassword) {
      response.status(419).json({
        error: true,
        message: "Password not same as confrim password",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: name,
        surname: surname,
        fatherName: fatherName,
        email: email,
        agreement: agreement,
        phone: phone,
        password: hashPassword,
      });
      newUser
        .save()
        .then(() => {
          sendOtpVerificationEmail(newUser, response);
        })
        .catch((error) => {
          response.status(500).json({
            error: true,
            message: error.message,
          });
        });
    }
  } catch (error) {
    response.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp) {
      res.status(419).json({
        error: true,
        message: "Empty details not allowed",
      });
    } else {
      const UserOtpRecords = await UserOTPVerification.find({ userId: userId });
      if (UserOtpRecords.length <= 0) {
        res.status(404).json({
          error: true,
          message: "Accunt record not found",
        });
      } else {
        const { expiresAt } = UserOtpRecords[0];
        const password = UserOtpRecords[0].otp;
        if (expiresAt < Date.now()) {
          UserOTPVerification.deleteMany({ userId: userId });
          res.status(419).json({
            error: true,
            message: "Code is expired",
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: "Code invalid",
            });
          } else {
            await user.updateOne({ _id: userId }, { verified: true });
            UserOTPVerification.deleteMany({ userId: userId });
            res.status(201).json({
              error: false,
              message: "Email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const sendOtpVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 900)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verification email",
      html: `<p>${otp}</p>`,
    };
    const newOtp = new UserOTPVerification({
      userId: _id,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 120000,
    });
    await newOtp.save();
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      error: false,
      status: "PENDING",
      message: "Otp sent successfully",
      data: {
        userId: _id,
        email: email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};
const resendOtpCode = async (user, res) => {
  const { _id, email } = user;
  try {
    if (!_id || !email) {
      res.status(404).json({
        error: true,
        message: "Credentials are required",
      });
    } else {
      await UserOTPVerification.deleteMany({ userId: _id });
      sendOtpVerificationEmail({ _id: _id, email }, res);
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validator.validate(email)) {
      res
        .status(419)
        .json({ error: true, message: "Please enter a valid email address" });
    } else if (password.length < 6) {
      res.status(419).json({
        error: true,
        message: "Password must be at least 6 characters",
      });
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
        if (!user.verified) {
          resendOtpCode(user, res);
        } else {
          const matchPassword = await bcrypt.compare(password, user.password);
          if (matchPassword) {
            const token = await jwt.sign(
              { email: email, password: password },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              error: false,
              message: "User found",
              user: user,
              token: token,
            });
          } else {
            res
              .status(419)
              .json({ error: true, message: "Password is not valid" });
          }
        }
      } else {
        res.status(419).json({ error: true, message: "User not found" });
      }
    }
  } catch (error) {}
};
module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendOtpCode,
};
