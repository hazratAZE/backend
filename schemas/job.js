const mongoose = require("mongoose");

const Job = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lauch: {
      type: Boolean,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    agreement: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: "daily",
    },
    status: {
      type: Object,
      default: "active",
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saveUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    applicants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", Job);
