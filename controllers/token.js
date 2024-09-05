const user = require("../schemas/user");

const allTokens = async (req, res) => {
  try {
    const result = await user.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" },
        },
      },
    ]);

    const allTokensCount = result.length > 0 ? result[0].totalBalance : 0;

    res.status(200).json({
      error: false,
      data: allTokensCount,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = {
  allTokens,
};
