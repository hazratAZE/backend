const express = require("express");
const {
  changeRoleUser,
  changeRoleUserToStandard,
} = require("../controllers/master");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();

routes.post("/change", verifyJwt, changeRoleUser);
routes.post("/standard", verifyJwt, changeRoleUserToStandard);
module.exports = routes;
