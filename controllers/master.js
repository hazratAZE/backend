const user = require("../schemas/user");

const changeRoleUser = async (req, res) => {
  try {
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
      } else if (!experience) {
        res.status(419).json({
          error: {
            type: "experience",
            message: res.__("experiance_field_is_required"),
          },
        });
      } else if (!driveLicense) {
        res.status(419).json({
          error: {
            type: "drivelicense",
            message: res.__("driver_license_field_is_required"),
          },
        });
      } else if (!country) {
        res.status(419).json({
          error: {
            type: "country",
            message: res.__("country_field_is_required"),
          },
        });
      } else if (!phone) {
        res.status(419).json({
          error: {
            type: "phone",
            message: res.__("phone_field_is_required"),
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
      await myUser.save();
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
            longitude: longitude,
            latitude: latitude,
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
  changeRoleUser,
  changeRoleUserToStandard,
  updateUserLocation,
};
