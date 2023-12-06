const express = require("express");
const {
  changeRoleUser,
  changeRoleUserToStandard,
  updateUserLocation,
} = require("../controllers/master");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/change", verifyJwt, changeRoleUser);
routes.post("/standard", verifyJwt, changeRoleUserToStandard);
routes.post("/updateLocation", verifyJwt, updateUserLocation);
module.exports = routes;
