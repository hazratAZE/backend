const chat = require("../schemas/chat");
const messages = require("../schemas/messages");
const user = require("../schemas/user");

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
      const newMessage = new messages({
        sender: myUser._id,
        receiver: newUser._id,
        content: content,
        image: myUser.image,
      });
      await newMessage.save();
      res.status(404).json({
        error: true,
        message: "Message seded!",
      });
    }
  } catch (error) {
    res.status(404).json({
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
      res.status(404).json({
        error: true,
        message: "User not found!",
      });
    } else {
      const allMessages = await messages.find({
        sender: myUser,
        receiver: newUser,
        status: "send",
      });
      res.status(200).json({
        error: false,
        data: allMessages,
      });
    }
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
        message: "User not found",
      });
    } else {
      await messages.updateOne(
        {
          _id: id,
          sender: myUser,
        },
        { status: "deleted" }
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
};
