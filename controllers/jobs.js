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
      location,
      city,
      createdBy,
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
    } else if (!type) {
      return res.status(419).json({
        error: {
          type: "type",
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
      company: existingUser.name + " " + existingUser.surname,
      image: existingUser.image,
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

module.exports = {
  getAllJobs,
  createJob,
  getAllMyJobs,
};
