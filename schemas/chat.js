const mongoose = require("mongoose");

const Chat = new mongoose.Schema(
  {
    sender: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    receiver: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    senderImage: {
      type: String,
    },
    receiverImage: {
      type: String,
    },
    senderName: {
      type: String,
    },
    receiverName: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Chat", Chat);
