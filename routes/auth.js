const express = require("express");
const {
  loginUser,
  registerUser,
  verifyEmail,
  resendOtpCode,
  initUser,
  logOut,
  deleteUser,
  forgotPassword,
  confirmForgotPasswordEmail,
  addNewPassword,
  updateUser,
  updatePassword,
  changeEmail,
  verifyChangeEmail,
  sendAgainOtp,
} = require("../controllers/auth");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      message: "App initialization is successful!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "App initialization is unsuccessful!",
    });
  }
});
routes.post("/login", loginUser);
routes.post("/register", registerUser);
routes.post("/verifyOtp", verifyEmail);
routes.post("/resendOtp", resendOtpCode);
routes.post("/initUser", initUser);
routes.post("/logOut", verifyJwt, logOut);
routes.post("/delete", verifyJwt, deleteUser);
routes.post("/forgotPassword", forgotPassword);
routes.post("/confirmForgotPasswordEmail", confirmForgotPasswordEmail);
routes.post("/addNewPassword", addNewPassword);
routes.post("/update", verifyJwt, updateUser);
routes.post("/updatePassword", verifyJwt, updatePassword);
routes.post("/changeEmail", verifyJwt, changeEmail);
routes.post("/verifyChangeEmail", verifyJwt, verifyChangeEmail);
routes.post("/sendAgainOtp", sendAgainOtp);

module.exports = routes;
