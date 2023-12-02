const mongoose = require("mongoose");

const Info = new mongoose.Schema(
  {
    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Info", Info);
