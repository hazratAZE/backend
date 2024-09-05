const mongoose = require("mongoose");

const Tokeninfo = new mongoose.Schema(
  {
    percentages: {
      type: [Number],
      default: [],
    },
    usd: {
      type: Number,
      default: 1.69,
    },
    euro: {
      type: Number,
      default: 1.88,
    },
    try: {
      type: Number,
      default: 0.05,
    },
    rub: {
      type: Number,
      default: 0.019,
    },
    kzt: {
      type: Number,
      default: 0.0035,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Tokeninfo", Tokeninfo);
