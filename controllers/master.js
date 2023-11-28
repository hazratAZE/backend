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
    } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        messsage: "User not found",
      });
    } else {
      if (!category) {
        res.status(419).json({
          error: {
            type: "category",
            message: "Category is required",
          },
        });
      } else if (categorySpecific.length < 4) {
        res.status(419).json({
          error: {
            type: "subcategory",
            message: "Subcategory is required",
          },
        });
      } else if (!age) {
        res.status(419).json({
          error: {
            type: "age",
            message: "Age is required",
          },
        });
      } else if (!gender) {
        res.status(419).json({
          error: {
            type: "gender",
            message: "Gender is required",
          },
        });
      } else if (!experience) {
        res.status(419).json({
          error: {
            type: "experience",
            message: "Experience is required",
          },
        });
      } else if (!driveLicense) {
        res.status(419).json({
          error: {
            type: "drivelicense",
            message: "Drive license section is required",
          },
        });
      } else if (!country) {
        res.status(419).json({
          error: {
            type: "country",
            message: "Country section is required",
          },
        });
      } else if (!phone) {
        res.status(419).json({
          error: {
            type: "phone",
            message: "Phone section is required",
          },
        });
      } else if (!city) {
        res.status(419).json({
          error: {
            type: "city",
            message: "City  section is required",
          },
        });
      } else if (address.length < 6) {
        res.status(419).json({
          error: {
            type: "address",
            message: "Address section is must be at least 6 charactest",
          },
        });
      } else if (about.length < 60) {
        res.status(419).json({
          error: {
            type: "about",
            message: "About section must be at least 60 characters",
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
module.exports = {
  changeRoleUser,
  changeRoleUserToStandard,
};
