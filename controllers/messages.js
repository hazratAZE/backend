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
      if (!newUser || newUser.status == "deleted") {
        res.status(419).json({
          error: true,
          message: "User deleted!",
        });
      } else {
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
            `${myUser.name} ${myUser.surname} ✉️`,
            `${newMessage.content}`,
            "message",
            myUser._id,
            myUser.image,
            myUser.email,
            myUser.name + " " + myUser.surname
          );
          res.status(200).json({
            error: false,
            message: "Message seded!",
          });
        }
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
    const { id, limit } = req.body;
    const newUser = await user.findOne({ _id: id });
    const myUser = await user.findOne({ email: email });

    if (!myUser || !newUser) {
      return res.status(419).json({
        error: true,
        message: res.__("user_not_found"),
      });
    }

    var lastMessages = await messages.find({
      $or: [
        { sender: myUser, receiver: newUser },
        { sender: newUser, receiver: myUser },
      ],
      status: { $in: ["send", "read"], $ne: "deleted" },
    });
    const page = parseInt(req.query.page) || 1;
    const endIndex = page * limit;
    lastMessages = lastMessages.reverse();
    lastMessages = lastMessages.slice(0, endIndex);
    lastMessages = lastMessages.reverse();
    // Limit the result to 20 messages
    lastMessages = await Promise.all(
      lastMessages.map(async (oneJob) => {
        try {
          return {
            ...oneJob._doc,
            trDate: changeDate(oneJob.createdAt, res.__("today")),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
    res.status(200).json({
      error: false,
      data: lastMessages,
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
  createMessage,
  getMessages,
  deleteMessage,
  getMyNewMessageCount,
};
