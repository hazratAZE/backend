const express = require("express");
const {
  getAllMyNotifications,
  getNotificationsCount,
} = require("../controllers/notifications");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", verifyJwt, getAllMyNotifications);
routes.get("/count", verifyJwt, getNotificationsCount);

module.exports = routes;
