const mongoose = require("mongoose");

const Job = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lauch: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    see: {
      type: Number,
      default: 0,
    },
    agreement: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    criterion: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "AZN",
    },
    status: {
      type: Object,
      default: "pending",
    },
    location: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "AZE",
    },
    city: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endDate: {
      type: Date,
    },
    companyName: {
      type: String,
    },
    companyEmail: {
      type: String,
    },
    addedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: {
      type: [String],
      default: [],
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
    interview: {
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
Job.pre("save", function (next) {
  // Check if "endDate" is not already set
  if (!this.endDate) {
    // Calculate the endDate by adding 3 days to the createdAt date
    const endDate = new Date(this.createdAt);
    endDate.setDate(endDate.getDate() + 3);
    this.endDate = endDate;
  }

  next();
});
module.exports = mongoose.model("Job", Job);
