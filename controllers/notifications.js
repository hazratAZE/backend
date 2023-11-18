const notifications = require("../schemas/notifications");
const user = require("../schemas/user");

const createNotification = async (title, body, image, onPress, type) => {
  try {
    const newNotification = new notifications({
      title: title,
      body: body,
      image: image,
      onPressId: onPress,
      type: type,
    });
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.log(error);
  }
};
const getAllMyNotifications = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }
    const notificationsList = myUser.notifications; // Sadece iş kimliklerini alıyoruz
    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allNotifications = await notifications
      .find({ _id: { $in: notificationsList } })
      .sort({ createdAt: -1 });
    res.status(200).json({
      error: false,
      data: allNotifications,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getNotificationsCount = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }
    const notificationsList = myUser.notifications; // Sadece iş kimliklerini alıyoruz
    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allNotifications = await notifications
      .find({ _id: { $in: notificationsList } })
      .sort({ createdAt: -1 });
    const countOfNotifications = allNotifications.filter(
      (one) => one.status === "close"
    );
    res.status(200).json({
      error: false,
      data: countOfNotifications.length,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = {
  createNotification,
  getAllMyNotifications,
  getNotificationsCount,
};
