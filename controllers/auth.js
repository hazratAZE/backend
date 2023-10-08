const { response } = require("express");
const User = require("../schemas/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const registerUser = async (request, response) => {
  const { name, surname, fatherName, email, phone, password, confirmPassword } =
    request.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      response.status(419).json({
        error: true,
        message: "This email address is already registered",
      });
    }
    if (name.length < 2) {
      response.status(419).json({
        error: true,
        message: "Name must be at least 2 characters",
      });
    } else if (surname.length < 2) {
      response.status(419).json({
        error: true,
        message: "Surname must be at least 2 characters",
      });
    } else if (fatherName.length < 2) {
      response.status(419).json({
        error: true,
        message: "Fathername must be at least 2 characters",
      });
    } else if (email.length < 3) {
      response.status(419).json({
        error: true,
        message: "Email must be at least 3 characters",
      });
    } else if (phone.length == 0) {
      response.status(419).json({
        error: true,
        message: "Phone is required",
      });
    } else if (password.length < 6) {
      response.status(419).json({
        error: true,
        message: "Password must be at least 6 characters",
      });
    } else if (password !== confirmPassword) {
      response.status(419).json({
        error: true,
        message: "Password not same as confrim password",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: name,
        surname: surname,
        fatherName: fatherName,
        email: email,
        phone: phone,
        password: hashPassword,
      });
      newUser
        .save()
        .then(() => {
          response.status(201).json({
            error: false,
            message: "User saved successfully",
            user: newUser,
          });
        })
        .catch((error) => {
          response.status(500).json({
            error: false,
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
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email.length < 3) {
      res
        .status(419)
        .json({ error: true, message: "Email must be at least 3 characters" });
    } else if (password.length < 6) {
      res.status(419).json({
        error: true,
        message: "Password must be at least 6 characters",
      });
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
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
          res
            .status(419)
            .json({ error: true, message: "Password is not valid" });
        }
      } else {
        res.status(419).json({ error: true, message: "User not found" });
      }
    }
  } catch (error) {}
};
module.exports = {
  registerUser,
  loginUser,
};
