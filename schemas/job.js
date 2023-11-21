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
    term: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    agreement: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: Object,
      default: "active",
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
