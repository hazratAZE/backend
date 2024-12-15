const express = require("express");
const {
  allTokens,
  getAllPercents,
  createPercents,
  updatePercents,
  sellTokens,
  getAllTokenSells,
} = require("../controllers/token");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", allTokens);
routes.get("/percenteges", getAllPercents);
routes.post("/create", createPercents);
routes.post("/update", updatePercents);
routes.post("/sell", verifyJwt, sellTokens);
routes.get("/allSells", getAllTokenSells);

module.exports = routes;
