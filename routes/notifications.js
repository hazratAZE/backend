const express = require("express");
const {
  getAllMyNotifications,
  getNotificationsCount,
  openNotification,
  deleteNotification,
  deleteAllNotifications,
  openAllMyNotifications,
} = require("../controllers/notifications");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", verifyJwt, getAllMyNotifications);
routes.get("/count", verifyJwt, getNotificationsCount);
routes.post("/open", verifyJwt, openNotification);
routes.post("/delete", verifyJwt, deleteNotification);
routes.post("/deleteAll", verifyJwt, deleteAllNotifications);
routes.post("/openAll", verifyJwt, openAllMyNotifications);

module.exports = routes;
