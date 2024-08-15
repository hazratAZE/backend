const mongoose = require("mongoose");

const Day = new mongoose.Schema(
  {
    dateString: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Day", Day);
