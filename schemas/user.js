const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
    },
    fatherName: {
      type: String,
      required: [true, "Father name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    jobCatagory: {
      type: Object,
      required: [true, "Job catagory is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    agreement: {
      type: Boolean,
      required: [true, "Agreement is required"],
    },
    image: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
    },
    addedJobs: {
      type: [String],
      default: [],
    },
    status: {
      type: Object,
      default: { id: "1", status: "active" },
    },

    savedJobs: {
      type: [String],
      default: [],
    },
    reportedJobs: {
      type: [String],
      default: [],
    },
    appliedJobs: {
      type: [String],
      default: [],
    },
    city: {
      type: Object,
      default: "",
    },
    cv: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    messages: {
      type: [String],
      default: [],
    },
    notifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
