const express = require("express");

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

module.exports = routes;
