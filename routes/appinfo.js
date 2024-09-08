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
      data: "1.2.6",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/getAppInfo", async function (req, res) {
  try {
    const { id } = req.query;
    if (id) {
      const pushAvalable = await appinfo.findOne({ _id: id });
      res.status(200).json({
        error: false,
        data: pushAvalable.isAvailable,
      });
    } else {
      res.status(200).json({
        error: false,
        data: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.post("/updatePush", async function (req, res) {
  try {
    const { id } = req.query;
    const { isActive } = req.body;
    const pushAvalable = await appinfo.findOne({ _id: id });
    if (isActive) {
      pushAvalable.isAvailable = false;
    } else {
      pushAvalable.isAvailable = true;
    }
    await pushAvalable.save();
    res.status(200).json({
      error: false,
      message: isActive
        ? res.__("push_notifications_disabled")
        : res.__("push_notifications_activate"),
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
