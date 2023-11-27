const express = require("express");
const { verifyJwt } = require("../middleware/jwt");
const {
  getMessages,
  createMessage,
  deleteMessage,
  getMyNewMessageCount,
} = require("../controllers/messages");
const routes = express.Router();

routes.post("/all", verifyJwt, getMessages);
routes.post("/create", verifyJwt, createMessage);
routes.post("/delete", verifyJwt, deleteMessage);
routes.get("/myMessageCount", verifyJwt, getMyNewMessageCount);

module.exports = routes;
