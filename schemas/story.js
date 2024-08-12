const mongoose = require("mongoose");

const Story = new mongoose.Schema(
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
    small_image: {
      type: String,
      required: [true, "Titile is required"],
    },
    lang: {
      type: String,
      default: "az",
    },
    source: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "image",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Story", Story);
