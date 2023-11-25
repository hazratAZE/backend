const express = require("express");
const { createChat, getMyChats } = require("../controllers/chat");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/create", verifyJwt, createChat);
routes.get("/myChats", verifyJwt, getMyChats);

module.exports = routes;
