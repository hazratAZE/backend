const express = require("express");
const {
  allTokens,
  getAllPercents,
  createPercents,
  updatePercents,
} = require("../controllers/token");
const routes = express.Router();

routes.get("/", allTokens);
routes.get("/percenteges", getAllPercents);
routes.post("/create", createPercents);
routes.post("/update", updatePercents);

module.exports = routes;
