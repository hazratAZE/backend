const express = require("express");
const {
  changeRoleCompany,
  changeRoleUserToStandard,
  updateUserLocation,
} = require("../controllers/company");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/change", verifyJwt, changeRoleCompany);
routes.post("/standard", verifyJwt, changeRoleUserToStandard);
routes.post("/updateLocation", verifyJwt, updateUserLocation);
module.exports = routes;
