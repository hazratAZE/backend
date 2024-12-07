const express = require("express");
const {
  getAllNews,
  createNews,
  getOneNews,
  deleteNews,
} = require("../controllers/stories");
const routes = express.Router();

routes.get("/", getAllNews);
routes.post("/create", createNews);
routes.post("/getOne", getOneNews);
routes.post("/delete", deleteNews);

module.exports = routes;
