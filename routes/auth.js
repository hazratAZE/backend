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
  uploadImage,
  getAllUsers,
  getUserInfo,
  changeCallPermission,
  changeMapPermission,
  reportUser,
  googleRegister,
  getAllUsersMap,
  updateBalance,
  sendToken,
  addFeedback,
  changeCalendar,
  sendTokenCardId,
  getCahsback,
  disablePushNotifications,
  getAllPartners,
  getSalesList,
  getListSales,
} = require("../controllers/auth");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/users", getAllUsers);
routes.get("/usersMap", getAllUsersMap);
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
routes.post("/uploadImage", verifyJwt, uploadImage);
routes.post("/getUserInfo", getUserInfo);
routes.post("/changePrivateMode", verifyJwt, changeCallPermission);
routes.post("/changeMapPermission", verifyJwt, changeMapPermission);
routes.post("/reportUser", verifyJwt, reportUser);
routes.post("/updateBalance", verifyJwt, updateBalance);
routes.post("/sendGift", verifyJwt, sendToken);
routes.post("/sendGiftCardId", verifyJwt, sendTokenCardId);
routes.post("/googleAuth", googleRegister);
routes.post("/addFeedback", verifyJwt, addFeedback);
routes.post("/changeCalendar", verifyJwt, changeCalendar);
routes.post("/getCashback", verifyJwt, getCahsback);
routes.post("/disablePush", verifyJwt, disablePushNotifications);
routes.get("/salesList", verifyJwt, getSalesList);
routes.get("/listSales", verifyJwt, getListSales);
routes.get("/getAllPartners", getAllPartners);

module.exports = routes;
