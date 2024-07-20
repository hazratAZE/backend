const express = require("express");
const {
  getAllNews,
  createNews,
  getOneNews,
} = require("../controllers/stories");
const routes = express.Router();

routes.get("/", getAllNews);
routes.post("/create", createNews);
routes.post("/getOne", getOneNews);

module.exports = routes;
