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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    jobCategory: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
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
      default: "https://worklytest.s3.eu-north-1.amazonaws.com/image21.png",
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
    chat: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
        },
      ],
      default: [],
    },
    status: {
      type: String,
      default: "online",
    },
    reportReasons: {
      type: [String],
      default: [],
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
    blockUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    reportedUsers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
    },
    rating: {
      type: Number,
      default: 0,
    },
    notifications: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notifications",
        },
      ],
      default: [],
    },
    fcmToken: {
      type: String,
    },
    googleId: {
      type: String,
    },
    googleAuth: {
      type: Boolean,
      default: false,
    },
    call: {
      type: Boolean,
      default: true,
    },
    map: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    age: {
      type: String,
    },
    experience: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    address: {
      type: String,
    },
    driveLicense: {
      type: String,
    },
    categorySpecific: {
      type: String,
    },
    gender: {
      type: String,
    },
    about: {
      type: String,
    },
    country: {
      type: String,
    },
    fullName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
