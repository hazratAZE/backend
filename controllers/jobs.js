const job = require("../schemas/job");
const user = require("../schemas/user");

const getAllJobs = async (req, res) => {
  try {
    const allJobs = await job.find();
    res.status(200).json({
      error: false,
      data: allJobs,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const createJob = async (req, res) => {
  try {
    const { email } = req.user;
    const {
      title,
      description,
      lauch,
      term,
      salary,
      type,
      requirements,
      status,
      location,
      city,
      createdBy,
    } = req.body;

    // Check if any required fields are empty
    if (
      !title ||
      !description ||
      !lauch ||
      !term ||
      !salary ||
      !type ||
      !requirements ||
      !status ||
      !location ||
      !city
    ) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    // Check if the 'createdBy' user exists with the email from req.user
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        error: true,
        message: "User not found with the provided email",
      });
    }

    // Create a new job, assuming 'createdBy' is the user with the matching email
    const newJob = new job({
      title,
      description,
      lauch,
      term,
      salary,
      type,
      requirements,
      status,
      location,
      city,
      createdBy: existingUser, // Assign the user's ID as the 'createdBy' value
    });

    // Save the new job to the database
    const savedJob = await newJob.save();

    // Add the job object to the 'addedJobs' array of the user
    existingUser.addedJobs.push(savedJob);

    // Save the updated user document
    await existingUser.save();
    const responseObject = {
      error: false,
      data: {
        job: {
          title: savedJob.title,
          description: savedJob.description,
          // Add other job fields as needed
        },
        user: {
          email: existingUser.email,
          // Add other user fields as needed
        },
      },
    };
    res.status(201).json({
      error: false,
      data: responseObject,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  createJob,
};
