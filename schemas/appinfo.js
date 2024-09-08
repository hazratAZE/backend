const mongoose = require("mongoose");

const Info = new mongoose.Schema(
  {
    fcmToken: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Info", Info);
