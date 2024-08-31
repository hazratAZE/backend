const express = require("express");
const { createSale, getAllSales } = require("../controllers/sale");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.get("/", getAllSales);
routes.post("/create", verifyJwt, createSale);

module.exports = routes;
