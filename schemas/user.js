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
      type: String,
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
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
      required: true,
    },
    status: {
      type: String,
      default: "online",
    },
    likedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    savedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    reportedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    appliedJobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
    city: {
      type: String,
      required: true,
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
    type: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
