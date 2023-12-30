const mongoose = require("mongoose");

const Notifications = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Titile is required"],
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
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
