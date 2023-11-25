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
    newMessage: {
      type: Boolean,
      default: false,
    },
    newMessageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Chat", Chat);
