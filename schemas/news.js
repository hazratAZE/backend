const mongoose = require("mongoose");

const News = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("News", News);
