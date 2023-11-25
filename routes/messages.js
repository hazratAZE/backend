const express = require("express");
const { verifyJwt } = require("../middleware/jwt");
const {
  getMessages,
  createMessage,
  deleteMessage,
} = require("../controllers/messages");
const routes = express.Router();

routes.get("/all", verifyJwt, getMessages);
routes.post("/create", verifyJwt, createMessage);
routes.post("/delete", verifyJwt, deleteMessage);

module.exports = routes;
