const express = require("express");
const {
  createChat,
  getMyChats,
  deleteChat,
  openChat,
} = require("../controllers/chat");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/create", verifyJwt, createChat);
routes.post("/delete", verifyJwt, deleteChat);
routes.get("/myChats", verifyJwt, getMyChats);
routes.post("/openChat", verifyJwt, openChat);

module.exports = routes;
