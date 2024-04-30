const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Comment", Comment);
