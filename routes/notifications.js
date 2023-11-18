const express = require("express");
const { getAllMyNotifications } = require("../controllers/notifications");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", verifyJwt, getAllMyNotifications);
module.exports = routes;
