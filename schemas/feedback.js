const mongoose = require("mongoose");

const Feedback = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
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
module.exports = mongoose.model("Feedback", Feedback);
