const express = require("express");
const appinfo = require("../schemas/appinfo");

const routes = express.Router();

routes.get("/all", async function (req, res) {
  try {
    const allInfo = await appinfo.find();
    res.status(200).json({
      error: false,
      data: allInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/version", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: "1.0.7",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.post("/create", async function (req, res) {
  try {
    const { fcmToken } = req.body;
    if (fcmToken) {
      const newAppInfo = new appinfo({
        fcmToken: fcmToken,
      });
      await newAppInfo.save();
      res.status(200).json({
        error: false,
        data: newAppInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
module.exports = routes;
