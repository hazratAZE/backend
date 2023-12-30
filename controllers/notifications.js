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
      return res.status(419).json({
        error: true,
        message: res.__("user_not_found"),
      });
    }
    const notificationsList = myUser.notifications;

    // Pagination parameters - You can pass these as query parameters in your API request
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = page * 20; // Default limit is 10
    const startIndex = 0;
    const allNotifications = await notifications
      .find({ _id: { $in: notificationsList } })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const notificationList = await Promise.all(
      allNotifications.map((one) => {
        return {
          ...one._doc,
          trDate: changeDate(one.createdAt, res.__("today")),
          trTitle:
            one.type === "apply"
              ? res.__("you_have_new_apply")
              : res.__("success_register"),
          trBody:
            one.type === "apply"
              ? `${one.body} ${res.__("sended_request")}`
              : "test",
        };
      })
    );

    // Get total count of notifications to calculate total pages
    const totalNotificationsCount = notificationsList.length;
    const totalPages = Math.ceil(totalNotificationsCount / limit);

    // Response with pagination metadata
    res.status(200).json({
      error: false,
      data: notificationList,
      totalPages,
      currentPage: page,
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
const openAllMyNotifications = async (req, res) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user
      .findOne({ email: email })
      .populate("notifications");

    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Update the status of all notifications to "open" in the Notification model
    await notifications.updateMany(
      { _id: { $in: myUser.notifications.map((notif) => notif._id) } },
      { $set: { status: "open" } }
    );

    // Update the status of all notifications in myUser.notifications array
    myUser.notifications.forEach((notification) => {
      notification.status = "open";
    });

    await myUser.save();

    return res.status(200).json({
      error: false,
      message: "All notifications marked as read!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
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
      .populate("notifications");

    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Find the notification and remove it
    const notificationIndex = myUser.notifications.findIndex(
      (notif) => notif._id.toString() === id
    );

    if (notificationIndex !== -1) {
      myUser.notifications.splice(notificationIndex, 1); // Remove the notification from the array
      await myUser.save();

      // Delete the notification document from the Notification model
      return res.status(200).json({
        error: false,
        message: "Notification deleted!",
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "Bildirim bulunamadı",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const deleteAllNotifications = async (req, res) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user
      .findOne({ email: email })
      .populate("notifications");

    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Remove all notifications from the user's notifications array
    myUser.notifications = [];
    await myUser.save();

    // Delete all notifications associated with the user from the Notification model
    return res.status(200).json({
      error: false,
      message: "All notifications deleted!",
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
const changeDate = (backendTime, newDate) => {
  // Get today's date
  const today = new Date();
  const backendDate = new Date(backendTime);
  // Check if the parsed date is today
  if (
    backendDate.getDate() === today.getDate() &&
    backendDate.getMonth() === today.getMonth() &&
    backendDate.getFullYear() === today.getFullYear()
  ) {
    // Format the time as "hh:mm"
    const formattedTime =
      backendDate.getHours().toString().padStart(2, "0") +
      ":" +
      backendDate.getMinutes().toString().padStart(2, "0");

    // Create the user-friendly time format
    const userFriendlyTime = `${newDate} ${formattedTime}`;

    // userFriendlyTime now contains the desired format, e.g., "today 09:26"
    return userFriendlyTime;
  } else {
    // If the date is not today, you can handle it accordingly, e.g., display the full date.
    const userFriendlyDate = backendDate.toLocaleDateString();
    return userFriendlyDate;
  }
};
module.exports = {
  createNotification,
  getAllMyNotifications,
  getNotificationsCount,
  openNotification,
  deleteNotification,
  deleteAllNotifications,
  openAllMyNotifications,
};
