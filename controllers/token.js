const tokeninfo = require("../schemas/tokeninfo");
const tokensells = require("../schemas/tokensells");
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
const createPercents = async (req, res) => {
  try {
    const { myArray } = req.body;
    const newPercents = new tokeninfo({
      percentages: myArray,
    });
    await newPercents.save();
    res.status(200).json({
      error: false,
      data: newPercents,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updatePercents = async (req, res) => {
  try {
    const { usd, azn, euro, kzt, tl, percentage } = req.body;
    const myPercent = await tokeninfo.findOne({
      _id: "66d99d9b75dd59e7f490b4f0",
    });
    myPercent.percentages.push(percentage);
    if (usd) {
      myPercent.usd = usd;
    } else if (azn) {
      myPercent.azn = azn;
    } else if (kzt) {
      myPercent.kzt = kzt;
    } else if (tl) {
      myPercent.try = tl;
    } else if (euro) {
      myPercent.euro = euro;
    }
    await myPercent.save();
    res.status(200).json({
      error: false,
      data: myPercent,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getAllPercents = async (req, res) => {
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
    const { currency } = req.query;
    const allPercents = await tokeninfo.find();
    const convertedLast30Percentages = (conversionRate) => {
      const newList = allPercents[0].percentages.map((value) =>
        (value / conversionRate).toFixed(4)
      );
      return newList;
    };
    console.log(allPercents);
    if (allPercents.length > 0) {
      if (currency === "USD") {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            (allTokensCount *
              allPercents[0].percentages[
                allPercents[0].percentages.length - 1
              ]) /
            allPercents[0].usd
          ).toFixed(2),
          min_value: (
            Math.min(...allPercents[0].percentages) / allPercents[0].usd
          ).toFixed(4),
          max_value: (
            Math.max(...allPercents[0].percentages) / allPercents[0].usd
          ).toFixed(4),
          list: convertedLast30Percentages(allPercents[0].usd),
          data: (
            allPercents[0].percentages[allPercents[0].percentages.length - 1] /
            allPercents[0].usd
          ).toFixed(4), // USD to AZN
        });
      } else if (currency === "KZT") {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            (allTokensCount *
              allPercents[0].percentages[
                allPercents[0].percentages.length - 1
              ]) /
            allPercents[0].kzt
          ).toFixed(2),
          min_value: (
            Math.min(...allPercents[0].percentages) / allPercents[0].kzt
          ).toFixed(4),
          max_value: (
            Math.max(...allPercents[0].percentages) / allPercents[0].kzt
          ).toFixed(4),
          list: convertedLast30Percentages(allPercents[0].kzt),
          data: (
            allPercents[0].percentages[allPercents[0].percentages.length - 1] /
            allPercents[0].kzt
          ).toFixed(4), // KZT to AZN
        });
      } else if (currency === "RUB") {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            (allTokensCount *
              allPercents[0].percentages[
                allPercents[0].percentages.length - 1
              ]) /
            allPercents[0].rub
          ).toFixed(2),
          min_value: (
            Math.min(...allPercents[0].percentages) / allPercents[0].rub
          ).toFixed(4),
          max_value: (
            Math.max(...allPercents[0].percentages) / allPercents[0].rub
          ).toFixed(4),
          list: convertedLast30Percentages(allPercents[0].rub),
          data: (
            allPercents[0].percentages[allPercents[0].percentages.length - 1] /
            allPercents[0].rub
          ).toFixed(4), // RUB to AZN
        });
      } else if (currency === "TRY") {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            (allTokensCount *
              allPercents[0].percentages[
                allPercents[0].percentages.length - 1
              ]) /
            allPercents[0].try
          ).toFixed(2),
          min_value: (
            Math.min(...allPercents[0].percentages) / allPercents[0].try
          ).toFixed(4),
          max_value: (
            Math.max(...allPercents[0].percentages) / allPercents[0].try
          ).toFixed(4),
          list: convertedLast30Percentages(allPercents[0].try),
          data: (
            allPercents[0].percentages[allPercents[0].percentages.length - 1] /
            allPercents[0].try
          ).toFixed(4), // TRY to AZN
        });
      } else if (currency === "EUR") {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            (allTokensCount *
              allPercents[0].percentages[
                allPercents[0].percentages.length - 1
              ]) /
            allPercents[0].euro
          ).toFixed(2),
          min_value: (
            Math.min(...allPercents[0].percentages) / allPercents[0].euro
          ).toFixed(4),
          max_value: (
            Math.max(...allPercents[0].percentages) / allPercents[0].euro
          ).toFixed(4),
          list: convertedLast30Percentages(allPercents[0].euro),
          data: (
            allPercents[0].percentages[allPercents[0].percentages.length - 1] /
            allPercents[0].euro
          ).toFixed(4), // EUR to AZN
        });
      } else {
        res.status(200).json({
          error: false,
          percentage: (
            ((allPercents[0].percentages[
              allPercents[0].percentages.length - 1
            ] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) /
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ]) *
            100
          ).toFixed(2),
          isNegative:
            allPercents[0].percentages[allPercents[0].percentages.length - 1] -
              allPercents[0].percentages[
                allPercents[0].percentages.length - 2
              ] <
            0,
          total_amount: (
            allTokensCount *
            allPercents[0].percentages[allPercents[0].percentages.length - 1]
          ).toFixed(2),
          min_value: Math.min(...allPercents[0].percentages).toFixed(4),
          max_value: Math.max(...allPercents[0].percentages).toFixed(4),
          list:
            allPercents[0].percentages.length > 30
              ? allPercents[0].percentages.slice(-30) // Son 30 değeri getir
              : allPercents[0].percentages,
          data: allPercents[0].percentages[
            allPercents[0].percentages.length - 1
          ], // EUR to AZN
        });
      }
    } else {
      res.status(200).json({
        error: false,
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const sellTokens = async (req, res) => {
  try {
    const { email } = req.user;
    const {
      country,
      bank,
      card_number,
      card_type,
      tokens_count,
      currency,
      total_value,
    } = req.body;
    const myUser = await user.findOne({ email: email });
    if (myUser.balance < Number(tokens_count)) {
      return res.status(419).json({
        error: {
          type: "balance",
          message: res.__("balance_not_valid"),
        },
      });
    } else {
      if (!country) {
        return res.status(419).json({
          error: {
            type: "country",
            message: res.__("country_field_is_required"),
          },
        });
      } else if (!bank) {
        return res.status(419).json({
          error: {
            type: "bank",
            message: res.__("bank_section_is_required"),
          },
        });
      } else if (card_number.length < 16) {
        return res.status(419).json({
          error: {
            type: "card_number",
            message: res.__("card_number_is_required"),
          },
        });
      } else if (!card_type) {
        return res.status(419).json({
          error: {
            type: "card_type",
            message: res.__("select_card_type"),
          },
        });
      } else if (Number(tokens_count) < 100) {
        return res.status(419).json({
          error: {
            type: "tokens_count",
            message: res.__("sale_amount_at_least_100"),
          },
        });
      } else if (!currency) {
        return res.status(419).json({
          error: {
            type: "currency",
            message: res.__("currency_section_is_required"),
          },
        });
      } else if (!total_value) {
        return res.status(419).json({
          error: {
            type: "total",
            message: "Total value error",
          },
        });
      } else {
        const newSell = new tokensells({
          country: country,
          bank: bank,
          card_number: card_number,
          card_type: card_type,
          tokens_count: tokens_count,
          currency: currency,
          total_value: total_value,
          user: myUser._id,
        });
        myUser.balance = myUser.balance - Number(tokens_count);
        myUser.sellTokens.push(newSell);
        await myUser.save();
        await newSell.save();
        res.status(200).json({
          error: false,
          data: newSell,
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
  allTokens,
  getAllPercents,
  createPercents,
  updatePercents,
  sellTokens,
};
