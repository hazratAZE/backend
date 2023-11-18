const express = require("express");
const { getAllNews, createNews } = require("../controllers/news");
const routes = express.Router();

routes.get("/", getAllNews);
routes.post("/create", createNews);

module.exports = routes;
