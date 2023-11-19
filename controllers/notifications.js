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
const openNotification = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;

    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user
      .findOne({ email: email })
      .populate("notifications"); // Assuming notifications are referenced in myUser

    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const notification = await notifications.findOne({ _id: id });

    if (!notification) {
      return res.status(404).json({
        error: true,
        message: "Bildirim bulunamadı",
      });
    }

    // Update the status of the found notification to "open" in Notification model
    notification.status = "open";
    await notification.save();

    // Update the status of the notification in myUser.notifications array
    const notificationIndex = myUser.notifications.findIndex(
      (notif) => notif._id.toString() === id
    );

    if (notificationIndex !== -1) {
      myUser.notifications[notificationIndex].status = "open";
    }

    await myUser.save();

    return res.status(200).json({
      error: false,
      message: "Notification read!",
    });
  } catch (error) {
    return res.status(500).json({
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
  openNotification,
};
