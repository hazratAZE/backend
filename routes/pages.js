const express = require("express");
const { aboutPage } = require("../controllers/aboutPage");
const routes = express.Router();

routes.get("/", aboutPage);

module.exports = routes;
