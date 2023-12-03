const job = require("../schemas/job");
const user = require("../schemas/user");
const schedule = require("node-schedule");
var FCM = require("fcm-node");
const { createNotification } = require("./notifications");
var serverKey = process.env.MY_SERVER_KEY; //put your server key here
var fcm = new FCM(serverKey);
const getAllJobs = async (req, res) => {
  try {
    // Define a filter object based on query parameters
    const filter = {
      status: "active",
    };
    var jobs = [];
    const { typing, limit, rating } = req.query;
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
    var allJobs = await job.find(filter).sort({ createdAt: -1 });
    if (rating) {
      allJobs = await job.find(filter).sort({ rating: -1 });
    }
    if (limit) {
      allJobs = allJobs.slice(0, parseInt(limit));
    }
    if (req.query.typing) {
      allJobs = allJobs.filter((oneJob) =>
        oneJob.title.toLocaleLowerCase().includes(typing)
      );
    }
    if (req.query.email) {
      const myUser = await user.findOne({ email: req.query.email });
      jobs = await Promise.all(
        allJobs.map(async (oneJob) => {
          try {
            const newUser = await user.findOne(oneJob.createdBy);
            return {
              ...oneJob._doc,
              company: newUser.name + " " + newUser.surname,
              image: newUser.image,
              email: newUser.email,
              savedJob: myUser.savedJobs.includes(oneJob._id),
              likedJob: myUser.likedJobs.includes(oneJob._id),
              reportedJob: myUser.reportedJobs.includes(oneJob._id),
              myJob: myUser.addedJobs.includes(oneJob._id),
              appliedJobs: myUser.appliedJobs.includes(oneJob._id),
            };
          } catch (error) {
            console.error("Error fetching user details:", error);
            // Handle error if necessary, e.g., return the original job details
            return oneJob._doc;
          }
        })
      );
    } else {
      jobs = await Promise.all(
        allJobs.map(async (oneJob) => {
          try {
            const newUser = await user.findOne(oneJob.createdBy);
            return {
              ...oneJob._doc,
              company: newUser.name + " " + newUser.surname,
              image: newUser.image,
              email: newUser.email,
              savedJob: false,
              likedJob: false,
              reportedJob: false,
              myJob: false,
              appliedJobs: false,
            };
          } catch (error) {
            console.error("Error fetching user details:", error);
            // Handle error if necessary, e.g., return the original job details
            return oneJob._doc;
          }
        })
      );
    }
    // Fetch jobs with the applied filter

    res.status(200).json({
      error: false,
      data: jobs,
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
      salary,
      type,
      location,
      city,
      companyEmail,
      companyName,
      createdBy,
      agreement,
      category,
      criterion,
      longitude,
      latitude,
    } = req.body;

    // Check if any required fields are empty
    if (!category) {
      return res.status(419).json({
        error: {
          type: "category",
          message: "Type section is required",
        },
      });
    } else if (title.length < 2) {
      return res.status(419).json({
        error: {
          type: "title",
          message: "Title must be at least 2 characters",
        },
      });
    } else if (!type) {
      return res.status(419).json({
        error: {
          type: "type",
          message: "Type section is required",
        },
      });
    } else if (!city) {
      return res.status(419).json({
        error: {
          type: "city",
          message: "City section is required",
        },
      });
    } else if (location.length < 2) {
      return res.status(419).json({
        error: {
          type: "location",
          message: "Loaction must be at least 2 characters",
        },
      });
    } else if (!longitude || !latitude) {
      return res.status(419).json({
        error: {
          type: "map",
          message: "Please enter latitude and longitude",
        },
      });
    } else if (!salary) {
      return res.status(419).json({
        error: {
          type: "salary",
          message: "Salary section is required",
        },
      });
    } else if (!criterion) {
      return res.status(419).json({
        error: {
          type: "criterion",
          message: "Criterion section is required",
        },
      });
    } else if (!lauch) {
      return res.status(419).json({
        error: {
          type: "lauch",
          message: "Launch section is required",
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
    } else if (!companyEmail && req.query.type !== "Daily") {
      return res.status(419).json({
        error: {
          type: "companyEmail",
          message: "Company email is required",
        },
      });
    } else if (!companyName && req.query.type !== "Daily") {
      return res.status(419).json({
        error: {
          type: "companyName",
          message: "Company name is required",
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
      salary,
      type,
      location,
      city,
      agreement,
      category,
      criterion,
      companyEmail: companyEmail,
      companyName: companyName,
      createdBy: existingUser._id,
      longitude,
      latitude, // Assign the user's ID as the 'createdBy' value
    });

    let endDate = new Date();
    if (newJob.type === "Daily") {
      // Add 3 days if the job type is "Daily"
      endDate.setDate(endDate.getDate() + 3);
    } else {
      // Add one month if the job type is not "Daily"
      endDate.setMonth(endDate.getMonth() + 1);
    }
    // Save the new job to the database
    newJob.endDate = endDate;
    const savedJob = await newJob.save();
    // Schedule a job status update for 3 days in the future
    // Schedule the job status update
    scheduleJobStatusUpdate(savedJob._id, endDate);

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
    const allJobs = await job
      .find({ _id: { $in: jobIds } })
      .sort({ createdAt: -1 });
    jobList = allJobs.map((oneJob) => ({
      ...oneJob._doc,
      company: myUser.name + " " + myUser.surname,
      email: myUser.email,
      image: myUser.image,
      savedJob: myUser.savedJobs.includes(oneJob._id),
      likedJob: myUser.likedJobs.includes(oneJob._id),
      reportedJob: myUser.reportedJobs.includes(oneJob._id),
      myJob: myUser.addedJobs.includes(oneJob._id),
    }));
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
const getMySavedJobs = async (req, res) => {
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

    const jobIds = myUser.savedJobs;
    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobsList = await job.find({ _id: { $in: jobIds } });
    const allJobs = allJobsList.filter((job) => job.status !== "deleted");
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
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
const getMyLikedJobs = async (req, res) => {
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

    const jobIds = myUser.likedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobs = await job.find({ _id: { $in: jobIds } });
    jobList = allJobs.map((oneJob) => ({
      ...oneJob._doc,
      savedJob: myUser.savedJobs.includes(oneJob._id),
      likedJob: myUser.likedJobs.includes(oneJob._id),
      reportedJob: myUser.reportedJobs.includes(oneJob._id),
      myJob: myUser.addedJobs.includes(oneJob._id),
      appliedJob: myUser.appliedJobs.includes(oneJob._id),
    }));
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
const getMyReportedJobs = async (req, res) => {
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

    const jobIds = myUser.reportedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobsList = await job.find({ _id: { $in: jobIds } });
    const allJobs = allJobsList.filter((job) => job.status !== "deleted");
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
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
const getMyAppledJobs = async (req, res) => {
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

    const jobIds = myUser.appliedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    var allJobs = await job.find({ _id: { $in: jobIds } });
    allJobs = await allJobs.filter((job) => job.status !== "deleted");
    if (req.query.status === "active") {
      allJobs = await allJobs.filter((job) => job.status === "active");
    } else if (req.query.status === "closed") {
      allJobs = await allJobs.filter((job) => job.status === "closed");
    }
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
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
    const { id, email } = req.query;
    if (!id) {
      res.status(404).json({
        error: true,
        message: "Job not found",
      });
    } else {
      const newJob = await job
        .findOne({ _id: id })
        .populate("applicants", "name email surname image role");
      const userFromId = await user.findOne(newJob.createdBy);
      var addedJob = false;
      var savedJob = false;
      var likedJob = false;
      var reportedJob = false;
      var appliedJob = false;
      var timeToEnd = 0;
      const company = userFromId.name + " " + userFromId.surname;
      const userEmail = userFromId.email;
      const userImage = userFromId.image;
      // Initialize timeToEnd to 0

      if (email) {
        const myUser = await user.findOne({ email: email });
        addedJob = myUser.addedJobs.includes(newJob._id);
        savedJob = myUser.savedJobs.includes(newJob._id);
        likedJob = myUser.likedJobs.includes(newJob._id);
        reportedJob = myUser.reportedJobs.includes(newJob._id);
        appliedJob = myUser.appliedJobs.includes(newJob._id);
      }

      if (newJob) {
        if (newJob.endDate) {
          const now = new Date();
          const endDate = new Date(newJob.endDate);
          timeToEnd = Math.max(0, endDate - now);

          const formattedTimeToEnd = formatTimeRemaining(timeToEnd);

          const jobWithMyStatus = {
            ...newJob._doc,
            company: company,
            email: userEmail,
            image: userImage,
            addedJob: addedJob,
            savedJob: savedJob,
            likeJob: likedJob,
            reportedJob: reportedJob,
            appliedJob: appliedJob,
            timeToEnd: formattedTimeToEnd,
          };

          res.status(200).json({
            error: false,
            data: jobWithMyStatus,
          });
        } else {
          res.status(200).json({
            error: false,
            data: newJob,
          });
        }
      } else {
        res.status(404).json({
          error: true,
          message: "Job not found",
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
      res.status(404).json({
        error: true,
        message: "Please select status",
      });
    } else if (!email) {
      res.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });

      if (!myUser) {
        res.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        const currentJob = await job.findOne({ _id: id });

        if (!currentJob) {
          res.status(404).json({
            error: true,
            message: "Job not found",
          });
        } else {
          if (status === "active" && new Date() > currentJob.endDate) {
            res.status(419).json({
              error: false,
              message: "End date has already passed",
            });
          } else {
            await job.updateOne({ _id: id }, { status });
            const myJob = await job.findOne({ _id: id });

            res.status(200).json({
              error: false,
              data: myJob,
              message: "Status updated successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const saveJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.savedJobs = myUser.savedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job unsaved successfully",
        });
      } else {
        myJob.rating = myJob.rating + 1;
        myUser.savedJobs.push(myJob);
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job saved successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const likeJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.likedJobs = myUser.likedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job dislaked successfully",
        });
      } else {
        myUser.likedJobs.push(myJob);
        myJob.rating = myJob.rating + 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job liked successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const reportJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.reportedJobs = myUser.reportedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job unreported successfully",
        });
      } else {
        myUser.reportedJobs.push(myJob);
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job reported successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const applyJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { apply } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    const owner = await user.findOne({ _id: myJob.createdBy });
    if (myUser && myJob) {
      if (apply) {
        myUser.appliedJobs = myUser.appliedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.applicants = myJob.applicants.filter(
          (one) => one._id.toString() !== myUser._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myUser.save();
        await myJob.save();
        res.status(200).json({
          error: false,
          message: "Un apply successfully",
        });
      } else {
        myUser.appliedJobs.push(myJob);
        myJob.applicants.push(myUser);
        sendPushNotification(
          owner.fcmToken,
          "Yeni müraciətiniz var!",
          `${myUser.name} ${myUser.surname} sizin ${myJob.title} iş elanınıza ərizə göndərib.`
        );
        const notification = await createNotification(
          "Yeni müraciətiniz var!",
          `${myUser.name} ${myUser.surname} sizin ${myJob.title} iş elanınıza ərizə göndərib.`,
          myUser.image,
          myJob._id,
          "apply"
        );
        myJob.rating = myJob.rating + 1;
        owner.notifications.push(notification);
        await owner.save();
        await myUser.save();
        await myJob.save();
        res.status(200).json({
          error: false,
          message: "Apply successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });

    if (!myUser && !myJob && !id && !email) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      myUser.addedJobs = myUser.addedJobs.filter(
        (likedJob) => likedJob._id.toString() !== myJob._id.toString()
      );
      myJob.status = "deleted";
      await myJob.save();
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Job deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const editJob = async (req, res) => {
  try {
    const {
      title,
      description,
      lauch,
      term,
      salary,
      location,
      city,
      category,
      id,
    } = req.body;
    const { email } = req.user;
    if (
      !title ||
      !category ||
      !location ||
      !salary ||
      !description ||
      !city ||
      !term ||
      !lauch
    ) {
      res.status(419).json({
        error: true,
        message: "Missing required",
      });
    } else {
      await job.updateOne(
        { _id: id },
        {
          title: title,
          category: category,
          description: description,
          city: city,
          salary: salary,
          location: location,
          term: term,
          lauch: lauch,
        }
      );
      const newJob = await job.findOne({ _id: id });
      res.status(200).json({
        error: false,
        data: newJob,
      });
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
function formatTimeRemaining(milliseconds) {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  const timeParts = [];

  if (days > 0) {
    timeParts.push(`${days} day${days > 1 ? "s" : ""}`);
  }
  if (remainingHours > 0) {
    timeParts.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
  }
  if (remainingMinutes > 0) {
    timeParts.push(
      `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
    );
  }

  return timeParts.join(" ");
}
const sendPushNotification = (to, title, body) => {
  var message = {
    to: to,

    notification: {
      title: title,
      body: body,
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
module.exports = {
  getAllJobs,
  createJob,
  getAllMyJobs,
  getOneJob,
  getOneMyJob,
  updateJobStatus,
  saveJob,
  likeJob,
  reportJob,
  getMySavedJobs,
  getMyLikedJobs,
  getMyReportedJobs,
  applyJob,
  getMyAppledJobs,
  deleteJob,
  editJob,
  sendPushNotification,
};
