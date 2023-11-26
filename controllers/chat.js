const chat = require("../schemas/chat");
const user = require("../schemas/user");
const messages = require("../schemas/messages");

const createChat = async (req, res) => {
  try {
    const { id } = req.body;
    const { email } = req.user;

    if (!id || !email) {
      return res.status(404).json({
        error: true,
        message: "Invalid chat elements",
      });
    }

    const myUser = await user.findOne({ email: email });
    const newUser = await user.findOne({ _id: id });

    // Check if active chat already exists between these users
    const existingChat = await chat.findOne({
      sender: myUser,
      receiver: newUser,
      status: "active",
    });

    if (existingChat) {
      return res.status(200).json({
        error: false,
        message: "Chat already exists",
      });
    }
    const newChat = await chat.create({
      sender: myUser,
      receiver: newUser,
      image: newUser.image,
      title: newUser.name + " " + newUser.surname,
      status: "active", // Assuming you set the status while creating a chat
    });

    const existingChatForNewUser = newUser.chat.find(
      (chat) => chat.receiver.toString() === newUser._id.toString()
    );
    console.log(existingChatForNewUser);
    if (!existingChatForNewUser) {
      const newChatForOther = await chat.create({
        sender: newUser,
        receiver: myUser,
        image: myUser.image,
        title: myUser.name + " " + myUser.surname,
        status: "active",
      });
      await newChatForOther.save();
      newUser.chat.push(newChatForOther);
      await newUser.save();
    }
    await newChat.save();
    myUser.chat.push(newChat);
    await myUser.save();
    res.status(200).json({
      error: false,
      message: "Chat successfully created",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const openChat = async (req, res) => {
  try {
    const { id } = req.body;
    const { email } = req.user;

    if (!id || !email) {
      res.status(404).json({
        error: true,
        message: "Invalid id or email",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      const newUser = await user.findOne({ _id: id });

      // Update messages to "read" sent from newUser to myUser
      await messages.updateMany(
        {
          sender: newUser._id,
          receiver: myUser._id,
          status: "send",
        },
        { $set: { status: "read" } }
      );

      res.status(200).json({
        error: false,
        message: "Chat opened and messages updated to read",
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
    const chatIds = myUser.chat;

    const allMessagesCount = async (sender) => {
      const messageCount = await messages.countDocuments({
        sender: sender[0],
        receiver: myUser._id,
        status: "send", // Include both "send" and "read" statuses
      });
      return messageCount;
    };
    const getLastMessage = async (sender, rec) => {
      const lastMessage = await messages
        .find({
          $or: [
            {
              sender: sender[0],
              receiver: rec[0],
              status: { $in: ["send", "read"] },
            },
            {
              sender: rec[0],
              receiver: sender[0],
              status: { $in: ["send", "read"] },
            },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(1); // Sorting by createdAt and limiting to 1 message

      return lastMessage.length > 0 ? lastMessage[0].content : null;
    };

    const allChats = await chat.find({ _id: { $in: chatIds } });

    const newListPromises = allChats.map(async (oneChat) => ({
      ...oneChat._doc,
      newMessageCount: await allMessagesCount(oneChat.receiver),
      newMessage: (await allMessagesCount(oneChat.receiver)) > 0,
      lastMessage: await getLastMessage(oneChat.sender, oneChat.receiver),
    }));

    const newList = await Promise.all(newListPromises);

    res.status(200).json({
      error: false,
      data: newList,
    });
  } catch (error) {
    console.log(error.message);
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
      // Update chat status to "deleted"
      myChat.status = "deleted";
      await myChat.save();

      // Remove the chat from user's chat list
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
        message: "User or chat not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = { createChat, getMyChats, deleteChat, openChat };
