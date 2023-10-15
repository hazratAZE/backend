var jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    const jwt = req.headers.authorization;
    if (!jwt) {
      res.status(422).json({
        error: true,
        message: "Invalid authorization",
      });
    } else {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(422).json({
          error: true,
          message: "Invalid authorization",
        });
      } else {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        if (!user) {
          res.status(422).json({
            error: true,
            message: "Invalid authorization",
          });
        } else {
          req.user = user;
          next();
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

module.exports = { verifyJwt };
