const User = require("../schemas/user");

const loginUser = (req, res) => {
  const { name, surname } = req.body;

  const newUser = new User({
    name: name,
    surname: surname,
  });
  newUser
    .save()
    .then(() => {
      res.json({
        success: true,
        msg: "User saved successfully",
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        msg: "User saved failed",
        err: err,
      });
    });
};

module.exports = loginUser;
