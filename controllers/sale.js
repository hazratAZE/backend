const user = require("../schemas/user");

const createSale = async (req, res) => {
  try {
    const { email } = req.user;
    const { note, companyId, userId, price } = req.body;
    const company = await user.findOne({ _id: companyId });
    const myUser = await user.findOne({ email: email });

    if (!company) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else if (!note) {
      return res.status(419).json({
        error: {
          type: "note",
          message: "Note section is required",
        },
      });
    } else if (!price) {
      return res.status(419).json({
        error: {
          type: "price",
          message: "Price section is required",
        },
      });
    }
  } catch (error) {}
};
