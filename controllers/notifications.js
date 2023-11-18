const notifications = require("../schemas/notifications");

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
module.exports = { createNotification };
