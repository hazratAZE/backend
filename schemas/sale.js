const mongoose = require("mongoose");

const Sale = new mongoose.Schema(
  {
    note: {
      type: String,
      required: [true, "Titile is required"],
    },
    company: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    price: {
      type: String,
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
