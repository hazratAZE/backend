const chat = require("../schemas/chat");
const user = require("../schemas/user");

const createChat = async (req, res) => {
  try {
    const { id } = req.body;
    const { email } = req.user;
    if (!id || !email) {
      res.status(404).json({
        error: true,
        message: "Invalid chat elements",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      const newUser = await user.findOne({ _id: id });
      const newChat = new chat({
        sender: myUser,
        receiver: newUser,
        image: newUser.image,
        title: newUser.name + " " + newUser.surname,
      });
      await newChat.save();
      myUser.chat.push(newChat);
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Chat successfully created",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMyChats = async (req, res) => {
  try {
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    const chatIds = myUser.chat; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    var allChats = await chat.find({ _id: { $in: chatIds } });
    res.status(200).json({
      error: false,
      data: allChats,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const deleteChat = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    const myChat = await chat.findOne({ _id: id });
    if (myUser && myChat) {
      myUser.chat = myUser.chat.filter(
        (one) => one._id.toString() !== myChat._id.toString()
      );
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Chat deleted successfully",
      });
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = { createChat, getMyChats, deleteChat };
