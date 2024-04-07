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
    const myChatExist = await chat.findOne({
      sender: myUser,
      receiver: newUser,
      status: "active",
    });
    const yourChatExists = await chat.findOne({
      sender: newUser,
      receiver: myUser,
      status: "active",
    });

    if (!myChatExist) {
      const newChatMyUser = new chat({
        sender: myUser,
        receiver: newUser,
        senderImage: myUser.image,
        receiverImage: newUser.image,
        senderName: myUser.name + " " + myUser.surname,
        receiverName: newUser.name + " " + newUser.surname,
        receiverEmail: newUser.email,
        senderEmail: myUser.email,
        status: "active",
      });

      myUser.chat.push(newChatMyUser);

      await Promise.all([newChatMyUser.save(), myUser.save(), newUser.save()]);
    }

    if (!yourChatExists) {
      const newChatNewUser = new chat({
        sender: newUser,
        receiver: myUser,
        senderImage: newUser.image,
        receiverImage: myUser.image,
        senderName: newUser.name + " " + newUser.surname,
        receiverName: myUser.name + " " + myUser.surname,
        status: "active",
      });
      newUser.chat.push(newChatNewUser);

      await Promise.all([newChatNewUser.save(), myUser.save(), newUser.save()]);
    }

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
      res.status(419).json({
        error: true,
        message: "Invalid id or email",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      const newUser = await user.findOne({ _id: id });
      if (!newUser) {
        res.status(419).json({
          error: true,
          message: res.__("user_not_found"),
        });
      } else {
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
      // Update messages to "read" sent from newUser to myUser
    }
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
const getMyChats = async (req, res) => {
  try {
    const { email } = req.user;
    const { typing } = req.query;
    const myUser = await user.findOne({ email: email });
    const chatIds = myUser.chat;

    const allMessagesCount = async (sender) => {
      const messageCount = await messages.countDocuments({
        sender: sender[0],
        receiver: myUser._id,
        status: "send", // Include both "send" and "read" statuses
      });
      return messageCount ? messageCount : 0;
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

      return lastMessage.length > 0 ? lastMessage[0].content : "";
    };
    const getLastMessageTime = async (sender, rec) => {
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

      return lastMessage.length > 0 ? lastMessage[0].createdAt : null;
    };
    const allChats = await chat
      .find({ _id: { $in: chatIds } })
      .populate("receiver");
    // Populate the receiver field
    console.log(allChats);
    const newListPromises = allChats.map(async (oneChat) => {
      const receiver = oneChat.receiver[0];
      // Assuming one receiver per chat for simplicity
      return {
        ...oneChat._doc,
        receiverImage: receiver
          ? receiver.image
          : "https://api-private.atlassian.com/users/4b3537aa0667e335931a7982526af3d9/avatar",
        receiverEmail: receiver ? receiver.email : "",
        receiverName: receiver
          ? receiver.name + " " + receiver.surname
          : "user",
        newMessageCount: await allMessagesCount(oneChat.receiver),
        newMessage: (await allMessagesCount(oneChat.receiver)) > 0,
        lastMessage: await getLastMessage(oneChat.sender, oneChat.receiver),
        lastMessageTime: await getLastMessageTime(
          oneChat.sender,
          oneChat.receiver
        ),
        id: oneChat.receiver._id,
        trDate: changeDate(oneChat.createdAt, res.__("today")),
      };
    });

    var newList = await Promise.all(newListPromises);
    if (typing) {
      newList = newList.filter((oneJob) =>
        oneJob.receiverName.toLocaleLowerCase().includes(typing)
      );
    }
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
const blockUser = async (req, res) => {
  try {
    const { email } = req.user;
    const { id, block } = req.body;
    const myUser = await user.findOne({ email: email });
    const newUser = await user.findOne({ _id: id });
    let isUserBlocked = false;
    for (const blockedUser of myUser.blockUsers) {
      if (blockedUser._id.toString() === id._id) {
        isUserBlocked = true;
        break;
      }
    }
    if (!newUser || !myUser) {
      res.status(419).json({
        error: true,
        message: res.__("user_not_found"),
      });
    } else {
      if (!block) {
        if (!isUserBlocked) {
          myUser.blockUsers.push(newUser);
          await myUser.save();
          res.status(200).json({
            error: false,
            message: res.__("user_blocked"),
          });
        } else {
          res.status(200).json({
            error: false,
            message: res.__("user_already_blocked"),
          });
        }
      } else {
        myUser.blockUsers = myUser.blockUsers.filter(
          (blockedUser) => blockedUser._id.toString() !== newUser._id.toString()
        ); // Removing newUser from blockUsers list
        await myUser.save();
        res.status(200).json({
          error: false,
          message: res.__("user_unblocked"),
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
const getBlocklist = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      const blockList = myUser.blockUsers;
      // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
      const allBlockUsers = await user.find({ _id: { $in: blockList } });
      res.status(200).json({
        error: false,
        data: allBlockUsers,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  createChat,
  getMyChats,
  deleteChat,
  openChat,
  blockUser,
  getBlocklist,
};
