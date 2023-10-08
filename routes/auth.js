const express = require("express");
const { loginUser, registerUser } = require("../controllers/auth");
const { verifyJwt } = require("../middleware/jwt");

const routes = express.Router();

routes.get("/", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      message: "App initialization is successful!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "App initialization is unsuccessful!",
    });
  }
});
routes.post("/login", loginUser);
routes.post("/register", registerUser);

module.exports = routes;
