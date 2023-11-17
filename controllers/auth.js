const User = require("../schemas/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserOTPVerification = require("../schemas/UserOTPVerification");
const nodemailer = require("nodemailer");
const user = require("../schemas/user");
var validator = require("email-validator");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromBase64 } = require("@aws-sdk/util-base64-node"); // You may need to install this package

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const getAllUsers = async (req, res) => {
  try {
    const users = await user.find().sort({ rating: -1 });
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
  try {
    const user = await User.findOne({ email });
    if (user) {
      response.status(419).json({
        error: {
          type: "email",
          message: "This email address is already registered",
        },
      });
    } else if (!name) {
      response.status(419).json({
        error: { type: "name", message: "Name is required" },
      });
    } else if (!surname) {
      response.status(419).json({
        error: { type: "surname", message: "Surname is required" },
      });
    } else if (!validator.validate(email)) {
      response.status(419).json({
        error: { type: "email", message: "Please enter a valid email address" },
      });
    } else if (password.length < 6) {
      response.status(419).json({
        error: {
          type: "password",
          message: "Password must be at least 6 characters",
        },
      });
    } else if (password !== confirmPassword) {
      response.status(419).json({
        error: {
          type: "confirmPassword",
          message: "Confirm password not same",
        },
      });
    } else if (!agreement) {
      response.status(419).json({
        error: { type: "agreement", message: "Agreement is required" },
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: name,
        surname: surname,
        email: email,
        agreement: agreement,
        password: hashPassword,
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
        message: "Empty details not allowed",
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
            message: "Code is expired",
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: "Code invalid",
            });
          } else {
            await user.updateOne({ _id: userId }, { verified: true });
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
      html: `<p>your verification code is ${otp}</p>`,
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
  const { email, password } = req.body;

  try {
    if (!validator.validate(email)) {
      res.status(419).json({
        error: { type: "email", message: "Please enter a valid email address" },
      });
    } else if (password.length < 6) {
      res.status(419).json({
        error: {
          type: "password",
          message: "Password must be at least 6 characters",
        },
      });
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
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
                message: "Password is not valid",
              },
            });
          }
        }
      } else {
        res.status(419).json({
          error: {
            type: "email",
            message: "User not found",
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
    console.log("hello");
    const { email } = req.body;
    if (!email) {
      res.status(419).json({
        error: {
          type: "email",
          message: "Please enter valid email address",
        },
      });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(419).json({
          error: {
            type: "email",
            message: "User not found",
          },
        });
      } else {
        resendOtpCode({ email: user.email, _id: user._id }, res);
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
        message: "Empty details not allowed",
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
            message: "Code is expired",
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: "Code invalid",
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
          message: "Password must be at least 6 characters",
        },
      });
    } else if (password !== confirmPassword) {
      res.status(419).json({
        error: {
          type: "confirm_password",
          message: "Confirm password not same as password",
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
    const { name, surname, fatherName, status, city, jobCatagory } = req.body;
    const { email } = req.user;

    if (!email) {
      res.status(419).json({
        error: true,
        message: "Authentication failed",
      });
    } else if (!name) {
      res.status(419).json({
        error: { type: "name", message: "Name is required" },
      });
    } else if (!surname) {
      res.status(419).json({
        error: { type: "surname", message: "Surname is required" },
      });
    } else if (!fatherName) {
      res.status(419).json({
        error: { type: "fatherName", message: "Father name is required" },
      });
    } else if (!jobCatagory) {
      res.status(419).json({
        error: {
          type: "jobCatagory",
          message: "Job catagory section is required",
        },
      });
    } else {
      await User.updateOne(
        { email: email },
        {
          name: name,
          surname: surname,
          fatherName: fatherName,
          status: status,
          city: city,
          jobCatagory: jobCatagory,
        }
      );
      const myUser = await User.findOne({ email: email });
      res.status(200).json({
        error: false,
        message: "User has been updated",
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
          message: "Password must be at least 6 characters",
        },
      });
    } else if (newPassword.length < 6) {
      res.status(419).json({
        error: {
          type: "newPassword",
          message: "Password must be at least 6 characters",
        },
      });
    } else if (confirmNewPassword.length < 6) {
      res.status(419).json({
        error: {
          type: "confirmNewPassword",
          message: "Password must be at least 6 characters",
        },
      });
    } else if (newPassword !== confirmNewPassword) {
      res.status(419).json({
        error: {
          type: "confirmNewPassword",
          message: "Passwords do not match",
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
        console.log(myUser.password);
        if (!matchPassword) {
          res.status(419).json({
            error: {
              type: "password",
              message: "Password not correct",
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
          message: "Please enter a valid email address",
        },
      });
    } else {
      const myUser = await user.findOne({ email: newEmail });
      const newUser = await user.findOne({ email: email });
      if (myUser) {
        res.status(419).json({
          error: {
            type: "email",
            message: "This email address already exists",
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
        message: "Empty details not allowed",
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
            message: "Code is expired",
          });
        } else {
          if (password !== otp) {
            res.status(419).json({
              error: true,
              message: "Code invalid",
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
const getUserInfo = async (req, res) => {
  try {
    const { email } = req.body;
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        error: false,
        data: myUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
  }
};
const changePrivateMode = async (req, res) => {
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
        myUser.privateMode = true;
      } else {
        myUser.privateMode = false;
      }
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Private mode has been changed",
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
module.exports = {
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
  getUserInfo,
  changePrivateMode,
};
