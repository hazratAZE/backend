const messages = require("../schemas/messages");
const user = require("../schemas/user");
const { sendPushNotification } = require("./jobs");

const createMessage = async (req, res) => {
  try {
    const { id, content } = req.body;
    const { email } = req.user;

    if (!id || !email) {
      res.status(404).json({
        error: true,
        message: "Invalid id or email",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      const newUser = await user.findOne({ _id: id });
      if (newUser.blockUsers.includes(myUser._id)) {
        res.status(419).json({
          error: true,
          message: res.__("user_blocked_your_account"),
        });
      } else if (myUser.blockUsers.includes(newUser._id)) {
        res.status(419).json({
          error: true,
          message: res.__("you_blocked_this_account"),
        });
      } else {
        const newMessage = new messages({
          sender: myUser._id,
          receiver: newUser._id,
          content: content,
          image: myUser.image,
        });
        await newMessage.save();
        sendPushNotification(
          newUser.fcmToken,
          `${myUser.name} ${myUser.surname}`,
          `${newMessage.content}`,
          "message",
          myUser._id,
          myUser.image,
          myUser.email
        );
        res.status(200).json({
          error: false,
          message: "Message seded!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMyNewMessageCount = async (req, res) => {
  try {
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    const allMessagesCount = async () => {
      const messageCount = await messages.countDocuments({
        receiver: myUser._id,
        status: "send", // Include both "send" and "read" statuses
      });
      return messageCount ? messageCount : 0;
    };
    res.status(200).json({
      error: false,
      data: await allMessagesCount(),
    });
  } catch (error) {
    res.status(200).json({
      error: true,
      message: error.message,
    });
  }
};
const getMessages = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const newUser = await user.findOne({ _id: id });
    const myUser = await user.findOne({ email: email });

    if (!myUser || !newUser) {
      return res.status(419).json({
        error: true,
        message: res.__("user_not_found"),
      });
    }

    const allMessages = await messages.find({
      $or: [
        { sender: myUser, receiver: newUser },
        { sender: newUser, receiver: myUser },
      ],
      status: { $in: ["send", "read"] }, // Fetch messages with "send" or "read" status
      status: { $ne: "deleted" }, // Exclude messages with status "deleted"
    });
    res.status(200).json({
      error: false,
      data: allMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!id || !myUser) {
      res.status(404).json({
        error: true,
        message: "User not found or message ID missing",
      });
    } else {
      await messages.updateOne(
        {
          _id: id,
          sender: myUser._id, // Use myUser._id instead of myUser
        },
        { $set: { status: "deleted" } } // Use $set to update the status field
      );
      res.status(200).json({
        error: false,
        data: "Message deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
  getMyNewMessageCount,
};
