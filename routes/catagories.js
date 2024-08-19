const express = require("express");

const routes = express.Router();

routes.get("/jobCatagories", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "Information Technology (IT)",
        "Finance",
        "Healthcare",
        "Engineering",
        "Sales",
        "Marketing",
        "Education",
        "Customer Service",
        "Human Resources",
        "Digital Commerce",
        "Service Industry",
        "Law",
        "Construction",
        "Industry",
        "Transportation",
        "Arts & Entertainment",
        "Food Service",
        "Management",
        "Science",
        "Non-Profit Organizations",
        "Other",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/cities", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "Absheron",
        "Aghjabadi",
        "Aghdam",
        "Aghdash",
        "Aghstafa",
        "Aghsu",
        "Astara",
        "Babek",
        "Baku",
        "Balakan",
        "Barda",
        "Beylagan",
        "Bilasuvar",
        "Jabrayil",
        "Jalilabad",
        "Julfar",
        "Dashkesan",
        "Gedabek",
        "Ganja",
        "Goranboy",
        "Goychay",
        "Goygol",
        "Khachmaz",
        "Imishli",
        "Ismayilli",
        "Kelbajar",
        "Lachin",
        "Lankaran",
        "Lerik",
        "Masalli",
        "Mingachevir",
        "Naftalan",
        "Nakhchivan",
        "Neftchala",
        "Oguz",
        "Ordubad",
        "Kabala",
        "Kakh",
        "Gazakh",
        "Gobustan",
        "Kuba",
        "Kubadly",
        "Qusar",
        "Saatly",
        "Sabirabad",
        "Salyan",
        "Shamakhi",
        "Sheki",
        "Shamkir",
        "Sharur",
        "Shusha",
        "Siyazan",
        "Sumgait",
        "Terter",
        "Tovuz",
        "Ujar",
        "Yardymly",
        "Yevlakh",
        "Zaqatala",
        "Zangilan",
        "Zardab",
        "Samukh",
        "Shahbuz",
        "Shirvan",
        "Khankendi",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/salaries", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "1 ₼",
        "2 ₼",
        "3 ₼",
        "4 ₼",
        "5 ₼",
        "6 ₼",
        "7 ₼",
        "8 ₼",
        "9 ₼",
        "10 ₼",
        "12 ₼",
        "15 ₼",
        "18 ₼",
        "20 ₼",
        "25 ₼",
        "30 ₼",
        "50 ₼",
        "70 ₼",
        "100 ₼",
        "150 ₼",
        "200 ₼",
        "250 ₼",
        "300 ₼",
        "350 ₼",
        "400 ₼",
        "450 ₼",
        "500 ₼",
        "600 ₼",
        "700 ₼",
        "800 ₼",
        "900 ₼",
        "1000 ₼",
        "1200 ₼",
        "1500 ₼",
        "2000 ₼",
        "2500 ₼",
        "3000 ₼",
        "3000+ ₼",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
module.exports = routes;
