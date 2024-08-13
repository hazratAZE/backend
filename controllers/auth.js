const User = require("../schemas/user");
const Feedback = require("../schemas/feedback");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserOTPVerification = require("../schemas/UserOTPVerification");
const nodemailer = require("nodemailer");
const user = require("../schemas/user");
var validator = require("email-validator");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// You may need to install this package
const { createNotification } = require("./notifications");
const job = require("../schemas/job");
const { sendPushNotification } = require("./jobs");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const getAllUsers = async (req, res) => {
  try {
    const { email, typing, limit } = req.query;
    var users;
    const filter = {
      role: "master",
    };
    if (req.query.category) {
      filter.jobCategory = req.query.category;
    }
    if (req.query.city) {
      filter.city = req.query.city;
    }
    if (email) {
      users = await user
        .find({
          ...filter,
          email: { $ne: email }, // Exclude the user with the specified email
        })
        .sort({ rating: -1 });
    } else {
      users = await user.find(filter).sort({ rating: -1 });
    }
    const page = parseInt(req.query.page) || 1;
    const endIndex = page * limit;
    users = users.slice(0, endIndex);
    if (typing) {
      users = users.filter((oneJob) =>
        oneJob.fullName.toLocaleLowerCase().includes(typing)
      );
    }
    res.status(200).json({
      error: false,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getAllUsersMap = async (req, res) => {
  try {
    const { email, typing, limit } = req.query;
    var users;
    const filter = {
      role: "master",
      map: true,
    };
    if (req.query.category) {
      filter.jobCategory = req.query.category;
    }
    if (req.query.city) {
      filter.city = req.query.city;
    }
    if (email) {
      users = await user
        .find({
          ...filter,
          email: { $ne: email }, // Exclude the user with the specified email
        })
        .sort({ rating: -1 });
    } else {
      users = await user.find(filter).sort({ rating: -1 });
    }
    const page = parseInt(req.query.page) || 1;
    const endIndex = page * limit;
    users = users.slice(0, endIndex);
    if (typing) {
      users = users.filter((oneJob) =>
        oneJob.fullName.toLocaleLowerCase().includes(typing)
      );
    }
    res.status(200).json({
      error: false,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const registerUser = async (request, response) => {
  const { name, surname, email, password, confirmPassword, agreement } =
    request.body;
  // Function to generate an 8-digit unique card ID
  const generateUniqueCardId = async () => {
    let cardId;
    let cardIdExists = true;
    while (cardIdExists) {
      cardId = Math.floor(10000000 + Math.random() * 90000000); // Generate 8-digit number
      const existingUser = await User.findOne({ card_id: cardId });
      if (!existingUser) {
        cardIdExists = false;
      }
    }
    return cardId;
  };
  try {
    const user = await User.findOne({ email });
    if (user) {
      response.status(419).json({
        error: {
          type: "email",
          message: response.__("this_email_already_registered"),
        },
      });
    } else if (!name) {
      response.status(419).json({
        error: {
          type: "name",
          message: response.__("name_section_is_required"),
        },
      });
    } else if (!surname) {
      response.status(419).json({
        error: {
          type: "surname",
          message: response.__("surname_section_is_required"),
        },
      });
    } else if (!validator.validate(email)) {
      response.status(419).json({
        error: {
          type: "email",
          message: response.__("please_enter_valid_email"),
        },
      });
    } else if (password.length < 6) {
      response.status(419).json({
        error: {
          type: "password",
          message: response.__("password_must_be_6"),
        },
      });
    } else if (password !== confirmPassword) {
      response.status(419).json({
        error: {
          type: "confirmPassword",
          message: response.__("comfirm_password_not_same"),
        },
      });
    } else if (!agreement) {
      response.status(419).json({
        error: {
          type: "agreement",
          message: response.__("agreement_required"),
        },
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const cardId = await generateUniqueCardId();
      const newUser = new User({
        name: name,
        surname: surname,
        email: email,
        fullName: `${name} ${surname}`,
        agreement: agreement,
        password: hashPassword,
        card_id: cardId.toString(),
      });
      newUser
        .save()
        .then(() => {
          sendOtpVerificationEmail(newUser, response);
        })
        .catch((error) => {
          response.status(500).json({
            error: true,
            message: error.message,
          });
        });
    }
  } catch (error) {
    response.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp) {
      res.status(419).json({
        error: true,
        message: res.__("enter_the_code"),
      });
    } else {
      const UserOtpRecords = await UserOTPVerification.find({ userId: userId });
      if (UserOtpRecords.length <= 0) {
        res.status(404).json({
          error: true,
          message: "Accunt record not found",
        });
      } else {
        const { expiresAt } = UserOtpRecords[0];
        const password = UserOtpRecords[0].otp;
        if (expiresAt < Date.now()) {
          UserOTPVerification.deleteMany({ userId: userId });
          res.status(419).json({
            error: true,
            message: res.__("code_is_expired"),
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: res.__("code_is_incorrect"),
            });
          } else {
            await user.updateOne({ _id: userId }, { verified: true });
            const myUser = await user.findOne({ _id: userId });
            const notification = await createNotification(
              "Register",
              `${myUser.name} ${myUser.surname}`,
              myUser.image,
              myUser._id,
              "register"
            );
            myUser.notifications.push(notification);
            myUser.save();
            UserOTPVerification.deleteMany({ userId: userId });
            res.status(201).json({
              error: false,
              message: "Email verified successfully",
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
const sendOtpVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 900)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verification email",
      html: `
      <html>
        <body>
        <img src="https://worklytest.s3.eu-north-1.amazonaws.com/image23.png" alt="Image description" style="width: 200px; height: auto;" />
          <h1 style="color: black; font-size: 28px;">Your Verification Code</h1>
          <p style="font-size: 24px; padding: 8px; background-color: black; color: white; text-align: center; width: 100px;letter-spacing: 4px;font-weight: bold;">${otp}</p>
          <p>Please use the above code to verify your account.</p>
        </body>
      </html>
    `,
    };
    const newOtp = new UserOTPVerification({
      userId: _id,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 120000,
    });
    await newOtp.save();
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      error: false,
      status: "PENDING",
      message: "Otp sent successfully",
      data: {
        userId: _id,
        email: email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};
const resendOtpCode = async (user, res) => {
  const { _id, email } = user;

  try {
    if (!_id || !email) {
      res.status(404).json({
        error: true,
        message: "Credentials are required",
      });
    } else {
      await UserOTPVerification.deleteMany({ userId: _id });
      sendOtpVerificationEmail({ _id: _id, email }, res);
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password, fcmtoken } = req.body;

  try {
    if (!validator.validate(email)) {
      res.status(419).json({
        error: {
          type: "email",
          message: res.__("please_enter_valid_email"),
        },
      });
    } else if (password.length < 6) {
      res.status(419).json({
        error: {
          type: "password",
          message: res.__("password_must_be_6"),
        },
      });
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
        if (user.googleAuth) {
          res.status(419).json({
            error: {
              type: "email",
              message: res.__("google_auth"),
            },
          });
        } else {
          if (!user.verified) {
            resendOtpCode(user, res);
          } else {
            const matchPassword = await bcrypt.compare(password, user.password);
            if (matchPassword) {
              const token = await jwt.sign(
                { email: email, password: password },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              user.fcmToken = fcmtoken;
              await user.save();
              res.status(200).json({
                error: false,
                message: "User found",
                user: user,
                token: token,
              });
            } else {
              res.status(419).json({
                error: {
                  type: "password",
                  message: res.__("password_is_incorrect"),
                },
              });
            }
          }
        }
      } else {
        res.status(419).json({
          error: {
            type: "email",
            message: res.__("user_not_found"),
          },
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
const initUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(419).json({
        error: {
          type: "token",
          message: "Token not found",
        },
      });
    } else {
      const userInfo = jwt.decode(token, process.env.JWT_SECRET);
      if (!userInfo) {
        res.status(419).json({
          error: {
            type: "token",
            message: "Token not found",
          },
        });
      } else {
        const myUser = await user.findOne({ email: userInfo.email });
        if (!myUser) {
          res.status(419).json({
            error: {
              type: "token",
              message: "User not found",
            },
          });
        } else {
          res.status(200).json({
            error: false,
            user: myUser,
          });
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
const logOut = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    }
    const newUser = await User.findOne({ email: email });
    if (!newUser) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      newUser.fcmToken = "";
      await newUser.save();
      res.status(200).json({
        error: false,
        message: "User logged out successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    }
    const newUser = await User.findOneAndDelete({ email: email });
    await job.updateMany(
      { createdBy: newUser._id },
      {
        $set: { status: "deleted" },
      }
    );
    if (!newUser) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.validate(email)) {
      res.status(419).json({
        error: {
          type: "email",
          message: res.__("please_enter_valid_email"),
        },
      });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(419).json({
          error: {
            type: "email",
            message: res.__("user_not_found"),
          },
        });
      } else {
        if (user.googleAuth) {
          res.status(419).json({
            error: {
              type: "email",
              message: res.__("google_auth"),
            },
          });
        } else {
          resendOtpCode({ email: user.email, _id: user._id }, res);
        }
      }
    }
  } catch (error) {
    res.json({
      error: {
        type: "server",
        message: error.message,
      },
    });
  }
};
const confirmForgotPasswordEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp) {
      res.status(419).json({
        error: true,
        message: res.__("please_enter"),
      });
    } else {
      const UserOtpRecords = await UserOTPVerification.find({ userId: userId });
      if (UserOtpRecords.length <= 0) {
        res.status(404).json({
          error: true,
          message: "Accunt record not found",
        });
      } else {
        const { expiresAt } = UserOtpRecords[0];
        const password = UserOtpRecords[0].otp;
        if (expiresAt < Date.now()) {
          UserOTPVerification.deleteMany({ userId: userId });
          res.status(419).json({
            error: true,
            message: res.__("code_is_expired"),
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: res.__("code_is_incorrect"),
            });
          } else {
            res.status(200).json({
              error: false,
              message: "Email verified successfully",
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
const addNewPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;
    if (password.length < 6) {
      res.status(419).json({
        error: {
          type: "password",
          message: res.__("password_must_be_6"),
        },
      });
    } else if (password !== confirmPassword) {
      res.status(419).json({
        error: {
          type: "confirm_password",
          message: res.__("comfirm_password_not_same"),
        },
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await user.updateOne({ email: email }, { password: hashPassword });
      UserOTPVerification.deleteMany({ userId: user._id });
      res.status(201).json({
        error: false,
        message: "Email verified successfully",
      });
    }
  } catch (error) {}
};

const updateUser = async (req, res) => {
  try {
    const phoneNumberPattern = /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
    const {
      name,
      surname,
      jobCategory,
      subCategory,
      city,
      address,
      gender,
      country,
      phone,
      age,
      military,
      github,
      linkedin,
      website,
      behance,
      education_level,
      education_info,
      work_info,
      skills,
      language_info,
      experience,
      driveLicense,
      awards_certificate,
      about,
    } = req.body;
    const { email } = req.user;
    const myUser = await User.findOne({ email: email });
    if (!email || !myUser) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    } else if (!name) {
      res.status(419).json({
        error: { type: "name", message: res.__("name_section_is_required") },
      });
    } else if (!surname) {
      res.status(419).json({
        error: {
          type: "surname",
          message: res.__("surname_section_is_required"),
        },
      });
    } else if (!jobCategory && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "jobCategory",
          message: res.__("job_category_is_required"),
        },
      });
    } else if (!subCategory && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "subCategory",
          message: res.__("subcategory_field_is_required"),
        },
      });
    } else if (!city && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "city",
          message: res.__("city_field_is_required"),
        },
      });
    } else if (!address && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "address",
          message: res.__("address_field_is_required"),
        },
      });
    } else if (!gender && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "gender",
          message: res.__("gender_field_is_required"),
        },
      });
    } else if (!country && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "country",
          message: res.__("country_field_is_required"),
        },
      });
    } else if (!phoneNumberPattern.test(phone) && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "phone",
          message: res.__("phone_field_is_required"),
        },
      });
    } else if (!age && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "age",
          message: res.__("age_field_is_required"),
        },
      });
    } else if (!experience && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "experience",
          message: res.__("experiance_field_is_required"),
        },
      });
    } else if (!driveLicense && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "driveLicense",
          message: res.__("driver_license_field_is_required"),
        },
      });
    } else if (!military && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "military",
          message: res.__("military_section_is_required"),
        },
      });
    } else if (!education_level && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "edu_level",
          message: res.__("edu_level_is_required"),
        },
      });
    } else if (!education_info && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "edu_info",
          message: res.__("edu_info_is_required"),
        },
      });
    } else if (!work_info && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "work_info",
          message: res.__("work_info_is_required"),
        },
      });
    } else if (!skills && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "skills",
          message: res.__("skills_section_is_required"),
        },
      });
    } else if (!language_info && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "language_info",
          message: res.__("language_skills_section_is_required"),
        },
      });
    } else if (!awards_certificate && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "awards_certificate",
          message: res.__("awards_section_is_required"),
        },
      });
    } else if (about && about.length < 60 && myUser.role === "master") {
      res.status(419).json({
        error: {
          type: "about",
          message: res.__("description_field_is_required"),
        },
      });
    } else {
      await User.updateOne(
        { email: email },
        {
          name: name,
          surname: surname,
          jobCategory: jobCategory,
          categorySpecific: subCategory,
          city: city,
          address: address,
          gender: gender,
          country: country,
          phone: phone,
          age: age,
          experience: experience,
          driveLicense: driveLicense,
          military: military,
          github: github,
          behance: behance,
          linkedin: linkedin,
          website: website,
          education_level: education_level,
          education_info: education_info,
          work_info: work_info,
          skills: skills,
          language_info: language_info,
          awards_certificate: awards_certificate,
          about: about,
          fullName: `${name} ${surname}`,
        }
      );
      const myUser = await User.findOne({ email: email });
      res.status(200).json({
        error: false,
        message: res.__("user_successfully_updated"),
        user: myUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { email } = req.user;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!email) {
      res.status(419).json({
        error: {
          type: "email",
          message: "Authentication failed",
        },
      });
    } else if (oldPassword.length < 6) {
      res.status(419).json({
        error: {
          type: "password",
          message: res.__("password_must_be_6"),
        },
      });
    } else if (newPassword.length < 6) {
      res.status(419).json({
        error: {
          type: "newPassword",
          message: res.__("password_must_be_6"),
        },
      });
    } else if (confirmNewPassword.length < 6) {
      res.status(419).json({
        error: {
          type: "confirmNewPassword",
          message: res.__("password_must_be_6"),
        },
      });
    } else if (newPassword !== confirmNewPassword) {
      res.status(419).json({
        error: {
          type: "confirmNewPassword",
          message: res.__("comfirm_password_not_same"),
        },
      });
    } else {
      const myUser = await user.findOne({ email: email });
      if (!myUser) {
        res.status(419).json({
          error: true,
          message: "User not found",
        });
      } else {
        const matchPassword = await bcrypt.compare(
          oldPassword,
          myUser.password
        );
        if (!matchPassword) {
          res.status(419).json({
            error: {
              type: "password",
              message: res.__("password_is_incorrect"),
            },
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPassword, salt);
          await user.updateOne({ email: email }, { password: hashPassword });
          res.status(201).json({
            error: false,
            message: "Password changed successfully",
          });
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
const changeEmail = async (req, res) => {
  try {
    const { email } = req.user;
    const { newEmail } = req.body;

    if (!email) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    } else if (!validator.validate(newEmail)) {
      res.status(419).json({
        error: {
          type: "email",
          message: res.__("please_enter_valid_email"),
        },
      });
    } else {
      const myUser = await user.findOne({ email: newEmail });
      const newUser = await user.findOne({ email: email });
      if (myUser) {
        res.status(419).json({
          error: {
            type: "email",
            message: res.__("this_email_already_registered"),
          },
        });
      } else {
        console.log({ _id: newUser._id, email: newEmail });
        resendOtpCode({ _id: newUser._id, email: newEmail }, res);
      }
    }
  } catch (error) {
    res.status(500).json({
      erro: true,
      message: error.message,
    });
  }
};
const verifyChangeEmail = async (req, res) => {
  const { userId, otp, newEmail } = req.body;
  const { email, password } = req.user;
  try {
    if (!userId || !otp) {
      res.status(419).json({
        error: true,
        message: res.__("please_enter"),
      });
    } else {
      const UserOtpRecords = await UserOTPVerification.find({ userId: userId });
      if (UserOtpRecords.length <= 0) {
        res.status(404).json({
          error: true,
          message: "Accunt record not found",
        });
      } else {
        const { expiresAt } = UserOtpRecords[0];
        const password = UserOtpRecords[0].otp;
        if (expiresAt < Date.now()) {
          UserOTPVerification.deleteMany({ userId: userId });
          res.status(419).json({
            error: true,
            message: res.__("code_is_expired"),
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: res.__("code_is_incorrect"),
            });
          } else {
            await user.updateOne(
              { email: email },
              {
                email: newEmail,
              }
            );
            const token = await jwt.sign(
              { email: newEmail, password: password },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              error: false,
              message: "Email change successfully",
              token: token,
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
const sendAgainOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(404).json({
        error: true,
        message: "Email address is required",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      if (!myUser) {
        res.status(404).json({
          error: true,
          message: "User not found",
        });
      } else {
        resendOtpCode({ _id: myUser._id, email: email }, res);
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const changeDate = (backendTime, newDate) => {
  // Get today's date
  const today = new Date();
  const backendDate = new Date(backendTime);
  // Check if the parsed date is today
  if (
    backendDate.getDate() === today.getDate() &&
    backendDate.getMonth() === today.getMonth() &&
    backendDate.getFullYear() === today.getFullYear()
  ) {
    // Format the time as "hh:mm"
    const formattedTime =
      backendDate.getHours().toString().padStart(2, "0") +
      ":" +
      backendDate.getMinutes().toString().padStart(2, "0");

    // Create the user-friendly time format
    const userFriendlyTime = `${newDate} ${formattedTime}`;

    // userFriendlyTime now contains the desired format, e.g., "today 09:26"
    return userFriendlyTime;
  } else {
    // If the date is not today, you can handle it accordingly, e.g., display the full date.
    const userFriendlyDate = backendDate.toLocaleDateString();
    return userFriendlyDate;
  }
};
const getUserInfo = async (req, res) => {
  try {
    const { emailUser } = req.body;
    const { email } = req.query;
    const { lang } = req.query;
    const myUser = await user.findOne({ email: email });
    const newUser = await user.findOne({ email: emailUser }).populate({
      path: "feedbacks",
      select: "user feedback date",
      options: { sort: { createdAt: -1 } }, // En yeni tarih ilk sırada olacak şekilde sıralama
    });
    var myUserTr;
    if (newUser.role != "user") {
      if (!email) {
        myUserTr = {
          ...newUser._doc,
          trCategory:
            lang == "az"
              ? newUser.jobCategory.split(",")[0]
              : lang == "ru"
              ? newUser.jobCategory.split(",")[1]
              : newUser.jobCategory.split(",")[2],
          trCity:
            lang == "az"
              ? newUser.city.split(",")[0]
              : lang == "ru"
              ? newUser.city.split(",")[1]
              : newUser.city.split(",")[2],
          blockMe: false,
          blockI: false,
          applies: newUser.appliedJobs.length,
          jobs: newUser.addedJobs.length,
          see: newUser.see,
          joined_time: changeDate(newUser.createdAt, res.__("today")),
        };
      } else {
        myUserTr = {
          ...newUser._doc,
          trCategory:
            lang == "az"
              ? newUser.jobCategory.split(",")[0]
              : lang == "ru"
              ? newUser.jobCategory.split(",")[1]
              : newUser.jobCategory.split(",")[2],
          trCity:
            lang == "az"
              ? newUser.city.split(",")[0]
              : lang == "ru"
              ? newUser.city.split(",")[1]
              : newUser.city.split(",")[2],
          blockMe: newUser.blockUsers.includes(myUser._id) ? true : false,
          blockI: myUser.blockUsers.includes(newUser._id) ? true : false,
          applies: newUser.appliedJobs.length,
          jobs: newUser.addedJobs.length,
          see: newUser.see,
          joined_time: changeDate(newUser.createdAt, res.__("today")),
        };
      }
    } else {
      if (!email) {
        myUserTr = {
          ...newUser._doc,
          blockMe: false,
          blockI: false,
        };
      } else {
        myUserTr = {
          ...newUser._doc,
          blockMe: newUser.blockUsers.includes(myUser._id) ? true : false,
          blockI: myUser.blockUsers.includes(newUser._id) ? true : false,
        };
      }
    }
    newUser.see = newUser.see + 1;
    await newUser.save();
    res.status(200).json({
      error: false,
      data: myUserTr,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
    console.log(error.message);
  }
};
const changeCallPermission = async (req, res) => {
  try {
    const { email } = req.user;
    const { mode } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      if (mode) {
        myUser.call = true;
      } else {
        myUser.call = false;
      }
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Call has been changed",
      });
    }
  } catch (error) {}
};
const changeMapPermission = async (req, res) => {
  try {
    const { email } = req.user;
    const { mode } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      if (mode) {
        myUser.map = true;
      } else {
        myUser.map = false;
      }
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Map permission has been changed",
      });
    }
  } catch (error) {}
};
const uploadImage = async (req, res) => {
  const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      // Convert the base64 image data to a Buffer
      const base64ImageData = req.files.data.data;
      console.log(req.files.data);
      // Set the S3 bucket and object key
      const params = {
        Bucket: "worklytest",
        Key: req.files.data.name, // Change the filename as needed
        Body: base64ImageData,
      };

      // Upload the image to S3
      const command = new PutObjectCommand(params);
      await s3Client.send(command, async (err, data) => {
        if (err) {
          res.status(500).json({
            error: true,
            message: err.message,
          });
        } else {
          await user.updateOne(
            { email: email },
            {
              image: `https://worklytest.s3.eu-north-1.amazonaws.com/${req.files.data.name}`,
            }
          );
          res.status(201).json({
            error: false,
            message: "Your image added successfully",
            data: data,
            location: `https://worklytest.s3.eu-north-1.amazonaws.com/${req.files.data.name}`,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Error uploading image to S3" });
  }
};
const reportUser = async (req, res) => {
  try {
    const { reason, id } = req.body;
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    const newUser = await user.findOne({ _id: id });
    if (!reason.length) {
      res.status(419).json({
        error: {
          type: "reason",
          message: res.__("reason_required"),
        },
      });
    } else {
      newUser.reportReasons.push(reason);
      await newUser.save();
      myUser.reportedUsers.push(newUser);
      await myUser.save();
      res.status(200).json({
        error: false,
        message: res.__("report_sended"),
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const googleRegister = async (req, res) => {
  try {
    const { name, surname, email, photo, googleId, fcmtoken } = req.body;
    const user = await User.findOne({ email });
    const generateUniqueCardId = async () => {
      let cardId;
      let cardIdExists = true;
      while (cardIdExists) {
        cardId = Math.floor(10000000 + Math.random() * 90000000); // Generate 8-digit number
        const existingUser = await User.findOne({ card_id: cardId });
        if (!existingUser) {
          cardIdExists = false;
        }
      }
      return cardId;
    };
    if (user) {
      if (!user.googleAuth) {
        res.status(419).json({
          error: {
            type: "email",
            message: res.__("this_email_already_registered"),
          },
        });
      } else {
        const user = await User.findOne({ googleId: googleId });
        const token = await jwt.sign(
          { email: email, password: "123456" },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        user.fcmToken = fcmtoken;
        await user.save();
        res.status(200).json({
          error: false,
          message: "User found",
          user: user,
          token: token,
        });
      }
    } else {
      const token = await jwt.sign(
        { email: email, password: "123456" },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const cardId = await generateUniqueCardId();
      const newUser = new User({
        name: name,
        surname: surname,
        email: email,
        fullName: `${name} ${surname}`,
        image: photo,
        fcmToken: fcmtoken,
        googleId: googleId,
        card_id: cardId,
        googleAuth: true,
        agreement: true,
      });
      await newUser.save();
      const notification = await createNotification(
        "Register",
        `${newUser.name} ${newUser.surname}`,
        newUser.image,
        newUser._id,
        "register"
      );
      newUser.notifications.push(notification);
      await newUser.save();
      res.status(200).json({
        error: false,
        message: "User found",
        user: newUser,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updateBalance = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(419).json({
        error: {
          type: "reason",
          message: "User not found",
        },
      });
    } else {
      myUser.balance = myUser.balance + 10;
      myUser.ad_watch_time = new Date();
      await myUser.save();
      res.status(200).json({
        error: false,
        message: res.__("balance_update_success"),
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const sendToken = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, userId } = req.body;
    const myUser = await user.findOne({ email: email });
    const otherUser = await user.findOne({ _id: userId });
    if (otherUser._id.toString() == myUser._id.toString()) {
      res.status(419).json({
        error: {
          type: "balance",
          message: res.__("card_belongs_to_you"),
        },
      });
    } else {
      if (myUser.balance >= amount) {
        myUser.balance = myUser.balance - Number(amount);
        otherUser.balance = otherUser.balance + Number(amount);
        await myUser.save();
        await otherUser.save();
        console.log(otherUser.fcmToken);
        sendPushNotification(
          otherUser.fcmToken,
          `${res.__("you_have_new_gift")} 🎁`,
          `${myUser.name} ${myUser.surname} ${res.__(
            "user_sent_you_a_gift"
          )}, ${amount} token`,
          "gift",
          myUser.email,
          myUser.image,
          myUser.email,
          myUser.name + " " + myUser.surname
        );
        const notification = await createNotification(
          "New gift",
          `${myUser.name} ${myUser.surname}`,
          myUser.image,
          myUser._id,
          "gift"
        );
        otherUser.notifications.push(notification);
        await otherUser.save();
        res.status(200).json({
          error: false,
          message: res.__("gift_sended_successfully"),
        });
      } else {
        res.status(419).json({
          error: {
            type: "balance",
            message: res.__("balance_not_valid"),
          },
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
const addFeedback = async (req, res) => {
  try {
    const { email } = req.user;
    const { userId, feedback } = req.body;
    const myUser = await user.findOne({ email: email });
    const otherUser = await user.findOne({ _id: userId });

    if (!feedback.trim()) {
      res.status(419).json({
        error: {
          type: "feedback",
          message: res.__("feedback_is_empty"),
        },
      });
    } else {
      const newFeedback = new Feedback({
        user: myUser.name + " " + myUser.surname,
        feedback: feedback.trim(),
      });
      otherUser.feedbacks.push(newFeedback);
      sendPushNotification(
        otherUser.fcmToken,
        `${res.__("you_have_new_feedback")} 💬`,
        `${myUser.name} ${myUser.surname} ${res.__(
          "send_your_feedback"
        )}, ${feedback.trim()}`,
        "feedback",
        myUser.email,
        myUser.image,
        myUser.email,
        myUser.name + " " + myUser.surname
      );
      const notification = await createNotification(
        "New feedback",
        `${myUser.name} ${myUser.surname}`,
        myUser.image,
        myUser._id,
        "feedback"
      );
      otherUser.notifications.push(notification);
      await otherUser.save();
      await newFeedback.save();

      res.status(200).json({
        error: false,
        message: res.__("feedback_sended_successfully"),
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
  reportUser,
  registerUser,
  loginUser,
  verifyEmail,
  resendOtpCode,
  initUser,
  logOut,
  deleteUser,
  forgotPassword,
  confirmForgotPasswordEmail,
  addNewPassword,
  updateUser,
  updatePassword,
  changeEmail,
  verifyChangeEmail,
  sendAgainOtp,
  uploadImage,
  getAllUsers,
  getAllUsersMap,
  getUserInfo,
  changeCallPermission,
  changeMapPermission,
  googleRegister,
  updateBalance,
  sendToken,
  addFeedback,
};
