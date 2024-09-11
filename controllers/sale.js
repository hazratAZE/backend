const user = require("../schemas/user");
const sale = require("../schemas/sale");
const tokeninfo = require("../schemas/tokeninfo");

const createSale = async (req, res) => {
  try {
    const { email } = req.user;
    const { note, price, currency } = req.body;
    const myUser = await user.findOne({ email: email });
    const allPercents = await tokeninfo.find();
    var localCurrency = 1;
    if (currency == "AZN") {
      localCurrency = 1;
    } else if (currency == "USD") {
      localCurrency = allPercents[0].usd;
    } else if (currency == "RUB") {
      localCurrency = allPercents[0].rub;
    } else if (currency == "KZT") {
      localCurrency = allPercents[0].kzt;
    } else if (currency == "EUR") {
      localCurrency = allPercents[0].euro;
    } else if (currency == "TRY") {
      localCurrency = allPercents[0].try;
    }

    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else if (!price || isNaN(Number(price))) {
      return res.status(419).json({
        error: {
          type: "price",
          message: res.__("add_sales_amount"),
        },
      });
    } else if (!note) {
      return res.status(419).json({
        error: {
          type: "note",
          message: res.__("note_section_is_required"),
        },
      });
    } else {
      if (myUser.balance < Math.round(price * localCurrency * 0.03 * 100)) {
        return res.status(419).json({
          error: {
            type: "balance",
            message: res.__("balance_not_valid"),
          },
        });
      } else {
        const newSale = new sale({
          note: note,
          company: myUser._id,
          note: note,
          cashback: Math.round(price * localCurrency * 0.03 * 100),
          price: price,
          currency: currency,
        });
        await newSale.save();
        myUser.sales.push(newSale);
        myUser.total_sale = Math.round(
          myUser.total_sale + Number(price * localCurrency)
        );
        myUser.total_cashback = Math.round(
          myUser.total_cashback + Number(price * localCurrency) * 0.03 * 100
        );
        myUser.balance =
          myUser.balance - Math.round(price * localCurrency * 0.03 * 100);
        await myUser.save();
        res.status(200).json({
          error: false,
          data: newSale,
          message: res.__("sale_created"),
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
const getAllSales = async (req, res) => {
  try {
    var allSales = await sale.find();
    res.status(200).json({
      error: false,
      data: allSales,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = {
  createSale,
  getAllSales,
};
