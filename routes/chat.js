const express = require("express");
const { createChat, getMyChats, deleteChat } = require("../controllers/chat");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/create", verifyJwt, createChat);
routes.post("/delete", verifyJwt, deleteChat);
routes.get("/myChats", verifyJwt, getMyChats);

module.exports = routes;
