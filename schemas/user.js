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
    company: {
      type: String,
      default: "",
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
    companyImage: {
      type: String,
      default:
        "https://worklytest.s3.eu-north-1.amazonaws.com/company_icon.png",
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
    busyDays: {
      type: Array,
      default: [],
    },
    total_sale: {
      type: Number,
      default: 0,
    },
    cashbacks_list: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sale",
        },
      ],
      default: [],
    },
    sales: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sale",
        },
      ],
      default: [],
    },
    total_cashback: {
      type: Number,
      default: 0,
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
    sellTokens: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tokensell",
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
    fcmIsAvaliable: {
      type: Boolean,
      default: true,
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
      default: false,
    },
    map: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    companyPhone: {
      type: String,
      default: "",
    },
    companyCountry: {
      type: String,
      default: "AZE",
    },
    companyCity: {
      type: String,
      default: "",
    },
    companyPhone: {
      type: String,
      default: "",
    },
    companyAddress: {
      type: String,
      default: "",
    },
    companyEmail: {
      type: String,
      default: "",
    },
    companyAbout: {
      type: String,
      default: "",
    },
    age: {
      type: String,
    },
    experience: {
      type: String,
    },
    companyLatitude: {
      type: String,
    },
    companyLongitude: {
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
    military: {
      type: String,
      default: "yes",
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    behance: {
      type: String,
      default: "",
    },
    education_level: {
      type: String,
      default: "Orta təhsil,Среднее образование,Secondary Education",
    },
    education_info: {
      type: String,
      default: "",
    },
    work_info: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: "",
    },
    awards_certificate: {
      type: String,
      default: "",
    },
    language_info: {
      type: String,
      default: "",
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
      default: "AZE",
    },
    fullName: {
      type: String,
    },
    balance: {
      type: Number,
      default: 50,
    },
    see: {
      type: Number,
      default: 0,
    },
    card_id: {
      type: String,
      required: true,
      unique: true,
    },
    apply_count: {
      type: Number,
      default: 0,
    },
    ad_watch_time: {
      type: Date,
      default: null,
    },
    feedbacks: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Feedback",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
