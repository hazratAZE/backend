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
    lang: {
      type: String,
      default: "az",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("News", News);
