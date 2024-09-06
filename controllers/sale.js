const user = require("../schemas/user");
const sale = require("../schemas/sale");

const createSale = async (req, res) => {
  try {
    const { email } = req.user;
    const { note, price } = req.body;
    const myUser = await user.findOne({ email: email });
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
      if (myUser.balance < Math.round(price * 0.03 * 100)) {
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
          cashback: Math.round(price * 0.03 * 100),
          price: price,
        });
        await newSale.save();
        myUser.sales.push(newSale);
        myUser.total_sale = Math.round(myUser.total_sale + Number(price));
        myUser.total_cashback = Math.round(
          myUser.total_cashback + Number(price) * 0.03 * 100
        );
        myUser.balance = myUser.balance - Math.round(price * 0.03 * 100);
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
