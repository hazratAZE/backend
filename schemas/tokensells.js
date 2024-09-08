const mongoose = require("mongoose");

const Tokensell = new mongoose.Schema(
  {
    country: {
      type: String,
    },
    bank: {
      type: String,
    },
    card_number: {
      type: String,
    },
    card_type: {
      type: String,
    },
    tokens_count: {
      type: Number,
    },
    currency: {
      type: String,
    },
    total_value: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
module.exports = mongoose.model("Tokensell", Tokensell);
