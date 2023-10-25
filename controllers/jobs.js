const job = require("../schemas/job");
const user = require("../schemas/user");
const schedule = require("node-schedule");

const getAllJobs = async (req, res) => {
  try {
    // Define a filter object based on query parameters
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.city) {
      filter.city = req.query.city;
    }
    if (req.query.salary) {
      filter.salary = req.query.salary;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // Fetch jobs with the applied filter
    const allJobs = await job.find(filter).sort({ createdAt: -1 });

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
      location,
      city,
      createdBy,
      agreement,
      category,
    } = req.body;

    // Check if any required fields are empty

    if (title.length < 2) {
      return res.status(419).json({
        error: {
          type: "title",
          message: "Title must be at least 2 characters",
        },
      });
    } else if (description.length < 60) {
      return res.status(419).json({
        error: {
          type: "description",
          message: "Description must be at least 60 characters",
        },
      });
    } else if (!agreement) {
      return res.status(419).json({
        error: {
          type: "agreement",
          message: "Agreement is required",
        },
      });
    } else if (!lauch) {
      return res.status(419).json({
        error: {
          type: "lauch",
          message: "Launch section is required",
        },
      });
    } else if (!term) {
      return res.status(419).json({
        error: {
          type: "term",
          message: "Term section is required",
        },
      });
    } else if (!salary) {
      return res.status(419).json({
        error: {
          type: "salary",
          message: "Salary section is required",
        },
      });
    } else if (!category) {
      return res.status(419).json({
        error: {
          type: "category",
          message: "Type section is required",
        },
      });
    } else if (location.length < 2) {
      return res.status(419).json({
        error: {
          type: "location",
          message: "Loaction must be at least 2 characters",
        },
      });
    } else if (!city) {
      return res.status(419).json({
        error: {
          type: "city",
          message: "City section is required",
        },
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
      location,
      city,
      agreement,
      company: existingUser.name + " " + existingUser.surname,
      category,
      image: existingUser.image,
      createdBy: existingUser, // Assign the user's ID as the 'createdBy' value
    });

    // Save the new job to the database
    const savedJob = await newJob.save();
    // Schedule a job status update for 3 days in the future
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Schedule the job status update
    scheduleJobStatusUpdate(savedJob._id, threeDaysFromNow);

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
const getAllMyJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const jobIds = myUser.addedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const jobList = await job.find({ _id: { $in: jobIds } });

    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getOneMyJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    if (!email) {
      req.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      if (!myUser) {
        req.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        const myJob = await job.findOne({ _id: id });
        res.status(200).json({
          error: false,
          data: myJob,
        });
      }
    }
  } catch (error) {
    req.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getOneJob = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(404).json({
        error: true,
        message: "Job not found",
      });
    } else {
      const newJob = await job.findOne({ _id: id });
      if (!newJob) {
        res.status(404).json({
          error: true,
          message: "Job not found",
        });
      } else {
        res.status(200).json({
          error: false,
          data: newJob,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updateJobStatus = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    const { status } = req.body;
    if (!status) {
      req.status(404).json({
        error: true,
        message: "Please select status",
      });
    } else if (!email) {
      req.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      if (!myUser) {
        req.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        await job.updateOne({ _id: id }, { status: status });
        const myJob = await job.findOne({ _id: id });
        res.status(200).json({
          error: false,
          data: myJob,
          message: "Status updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
function scheduleJobStatusUpdate(jobId, date) {
  schedule.scheduleJob(date, async () => {
    try {
      // Find the job by ID
      const jobToUpdate = await job.findOne({ _id: jobId });

      if (jobToUpdate) {
        // Update the job status to "closed"
        jobToUpdate.status = "closed";
        await jobToUpdate.save();
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  });
}
module.exports = {
  getAllJobs,
  createJob,
  getAllMyJobs,
  getOneJob,
  getOneMyJob,
  updateJobStatus,
};
