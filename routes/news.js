const express = require("express");
const {
  getAllNews,
  createNews,
  getOneNews,
  deleteNews,
} = require("../controllers/news");
const routes = express.Router();

routes.get("/", getAllNews);
routes.post("/create", createNews);
routes.post("/getOne", getOneNews);
routes.post("/deleteNews", deleteNews);

module.exports = routes;
