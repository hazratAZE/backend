const express = require("express");
const {
  createChat,
  getMyChats,
  deleteChat,
  openChat,
  blockUser,
  getBlocklist,
} = require("../controllers/chat");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/create", verifyJwt, createChat);
routes.post("/delete", verifyJwt, deleteChat);
routes.get("/myChats", verifyJwt, getMyChats);
routes.post("/openChat", verifyJwt, openChat);
routes.post("/blockUser", verifyJwt, blockUser);
routes.get("/getBlockList", verifyJwt, getBlocklist);

module.exports = routes;
