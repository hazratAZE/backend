const mongoose = require("mongoose");

const Sale = new mongoose.Schema(
  {
    note: {
      type: String,
      required: [true, "Titile is required"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
    },
    cashback: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Sale", Sale);
