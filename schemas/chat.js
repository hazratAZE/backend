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
    image: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
    title: {
      type: String,
    },
    newMessage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Chat", Chat);
