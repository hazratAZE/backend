const user = require("../schemas/user");
const job = require("../schemas/job");

const changeRoleUser = async (req, res) => {
  try {
    const phoneNumberPattern = /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
    const { email } = req.user;
    const {
      category,
      categorySpecific,
      age,
      gender,
      experience,
      driveLicense,
      phone,
      city,
      address,
      military,
      education_level,
      education_info,
      work_info,
      language_skills,
      skills_info,
      awards_info,
      github,
      linkedin,
      website,
      behance,
      about,
      country,
      longitude,
      latitude,
      agreement,
    } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: res.__("user_not_found"),
      });
    } else {
      if (!longitude || !latitude) {
        res.status(419).json({
          error: {
            type: "location",
            message: res.__("your_device_location_not_active"),
          },
        });
      } else if (!category) {
        res.status(419).json({
          error: {
            type: "category",
            message: res.__("job_category_is_required"),
          },
        });
      } else if (!categorySpecific) {
        res.status(419).json({
          error: {
            type: "subcategory",
            message: res.__("subcategory_field_is_required"),
          },
        });
      } else if (!age) {
        res.status(419).json({
          error: {
            type: "age",
            message: res.__("age_field_is_required"),
          },
        });
      } else if (!gender) {
        res.status(419).json({
          error: {
            type: "gender",
            message: res.__("gender_field_is_required"),
          },
        });
      } else if (!city) {
        res.status(419).json({
          error: {
            type: "city",
            message: res.__("city_field_is_required"),
          },
        });
      } else if (!address) {
        res.status(419).json({
          error: {
            type: "address",
            message: res.__("address_field_is_required"),
          },
        });
      } else if (!country) {
        res.status(419).json({
          error: {
            type: "country",
            message: res.__("country_field_is_required"),
          },
        });
      } else if (!phoneNumberPattern.test(phone)) {
        res.status(419).json({
          error: {
            type: "phone",
            message: res.__("phone_field_is_required"),
          },
        });
      } else if (!driveLicense) {
        res.status(419).json({
          error: {
            type: "drivelicense",
            message: res.__("driver_license_field_is_required"),
          },
        });
      } else if (!military) {
        res.status(419).json({
          error: {
            type: "military",
            message: res.__("military_section_is_required"),
          },
        });
      } else if (!education_level) {
        res.status(419).json({
          error: {
            type: "edu_level",
            message: res.__("edu_level_is_required"),
          },
        });
      } else if (!education_info) {
        res.status(419).json({
          error: {
            type: "edu_info",
            message: res.__("edu_info_is_required"),
          },
        });
      } else if (!experience) {
        res.status(419).json({
          error: {
            type: "experience",
            message: res.__("experience_field_is_required"),
          },
        });
      } else if (!work_info) {
        res.status(419).json({
          error: {
            type: "work_info",
            message: res.__("work_info_is_required"),
          },
        });
      } else if (!skills_info) {
        res.status(419).json({
          error: {
            type: "skills",
            message: res.__("skills_section_is_required"),
          },
        });
      } else if (!language_skills) {
        res.status(419).json({
          error: {
            type: "language_skills",
            message: res.__("language_skills_section_is_required"),
          },
        });
      } else if (!awards_info) {
        res.status(419).json({
          error: {
            type: "awards_info",
            message: res.__("awards_section_is_required"),
          },
        });
      } else if (about.length < 60) {
        res.status(419).json({
          error: {
            type: "about",
            message: res.__("description_field_is_required"),
          },
        });
      } else if (!agreement) {
        res.status(419).json({
          error: {
            type: "agreement",
            message: res.__("agreement_required"),
          },
        });
      } else {
        await user.updateOne(
          { email: email },
          {
            age: age,
            address: address,
            gender: gender,
            city: city,
            longitude: longitude,
            latitude: latitude,
            phone: phone,
            categorySpecific: categorySpecific,
            about: about,
            driveLicense: driveLicense,
            experience: experience,
            jobCategory: category,
            country: country,
            military: military,
            github: github,
            linkedin: linkedin,
            website: website,
            behance: behance,
            education_level: education_level,
            education_info: education_info,
            work_info: work_info,
            skills: skills_info,
            awards_certificate: awards_info,
            language_info: language_skills,
            role: "master",
          }
        );
        res.status(200).json({
          error: false,
          message: "Your account has been updated to professional status",
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
const changeRoleUserToStandard = async (req, res) => {
  try {
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User does not exist",
      });
    } else {
      await user.updateOne(
        { email: email },
        {
          role: "user",
        }
      );

      myUser.appliedJobs = [];
      myUser.busyDays = [];
      await myUser.save();
      const jobsToUpdate = await job.find({ applicants: myUser._id });

      for (const job of jobsToUpdate) {
        job.applicants = job.applicants.filter(
          (applicant) => !applicant.equals(myUser._id)
        );
        await job.save();
      }

      res.status(200).json({
        error: false,
        message: "User updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updateUserLocation = async (req, res) => {
  try {
    const { email } = req.user;
    const { longitude, latitude } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!email) {
      res.status(419).json({
        error: true,
        message: "User does not exist",
      });
    } else {
      if (!longitude || !latitude) {
        res.status(419).json({
          error: true,
          message: "Invalid latitude or longitude",
        });
      } else {
        if (myUser.role == "master" || myUser.role == "user") {
          await user.updateOne(
            { email: email },
            {
              longitude: longitude,
              latitude: latitude,
            }
          );
        }
        res.status(200).json({
          error: false,
          message: "User updated successfully",
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
module.exports = {
  changeRoleUser,
  changeRoleUserToStandard,
  updateUserLocation,
};
