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
      type: Object,
      required: true,
    },
    term: {
      type: Object,
      required: true,
    },
    salary: {
      type: Object,
      default: {
        id: 1,
        name: "active",
      },
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
      type: Object,
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
      type: Object,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
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
