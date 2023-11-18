const mongoose = require("mongoose");

const Notifications = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Titile is required"],
    },
    body: {
      type: String,
      required: [true, "Titile is required"],
    },
    image: {
      type: String,
      required: [true, "Titile is required"],
    },
    type: {
      type: String,
      required: [true, "Titile is required"],
    },
    status: {
      type: String,
      default: "close",
    },
    onPressId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Notifications", Notifications);
