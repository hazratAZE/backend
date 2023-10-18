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
    jobTimes: {
      type: String,
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
    type: {
      type: String,
      default: "daily",
    },
    requirements: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
