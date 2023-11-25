const mongoose = require("mongoose");

const Messages = new mongoose.Schema(
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
    chat: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
        },
      ],
    },
    image: {
      type: String,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      default: "send",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Messages", Messages);
