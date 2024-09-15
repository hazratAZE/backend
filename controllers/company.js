const user = require("../schemas/user");
const job = require("../schemas/job");

const changeRoleCompany = async (req, res) => {
  try {
    const phoneNumberPattern = /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
    const { email } = req.user;
    const {
      companyName,
      phone,
      city,
      address,
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
      } else if (!companyName) {
        res.status(419).json({
          error: {
            type: "company_name",
            message: res.__("company_name_is_required"),
          },
        });
      } else if (!city) {
        res.status(419).json({
          error: {
            type: "city",
            message: res.__("city_field_is_required"),
          },
        });
      } else if (!phoneNumberPattern.test(phone)) {
        res.status(419).json({
          error: {
            type: "phone",
            message: res.__("phone_field_is_required"),
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
            companyAddress: address,
            companyCity: city,
            companyLongitude: longitude,
            companyLatitude: latitude,
            companyPhone: phone,
            companyAbout: about,
            companyCountry: country,
            company: companyName,
            role: "bizness",
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
        await user.updateOne(
          { email: email },
          {
            companyLongitude: longitude,
            companyLatitude: latitude,
          }
        );
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
  changeRoleCompany,
  changeRoleUserToStandard,
  updateUserLocation,
};
