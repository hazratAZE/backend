const express = require("express");
const infopush = require("../schemas/infopush");
const appinfo = require("../schemas/appinfo");
const { sendPushNotification } = require("../controllers/jobs");

const routes = express.Router();

routes.get("/all", async function (req, res) {
  try {
    const allInfoPush = await infopush.find();
    res.status(200).json({
      error: false,
      data: allInfoPush,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/fcmcount", async function (req, res) {
  try {
    // FCM tokenların sayısını alın
    const tokenCount = await appinfo.countDocuments({
      fcmToken: { $exists: true, $ne: null },
    });

    res.status(200).json({
      error: false,
      count: tokenCount,
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
    const { body, title } = req.body;
    const allFcmTokens = await appinfo.find();

    if (!body || !title) {
      res.status(419).json({
        error: true,
        message: "Body and title must be provided",
      });
    } else {
      const pushNotif = new infopush({
        title: title,
        body: body,
      });
      await pushNotif.save();
      allFcmTokens.forEach(async (one) => {
        await sendPushNotification(
          one.fcmToken,
          `${title} 📢`,
          body,
          "info",
          one._id,
          "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
          "noemail",
          "Yolu Mobile",
          one.isAvailable
        );
      });
      res.status(200).json({
        error: false,
        data: pushNotif,
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
