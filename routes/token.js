const express = require("express");
const { allTokens } = require("../controllers/token");
const routes = express.Router();

routes.get("/", allTokens);

module.exports = routes;
