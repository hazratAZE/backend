const express = require("express");
const {
  getAllMyNotifications,
  getNotificationsCount,
  openNotification,
} = require("../controllers/notifications");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", verifyJwt, getAllMyNotifications);
routes.get("/count", verifyJwt, getNotificationsCount);
routes.post("/open", verifyJwt, openNotification);

module.exports = routes;
