const express = require("express");

const routes = express.Router();

routes.get("/jobCatagories", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "İnformasiya Texnologiyaları (IT)",
        "Maliyyə",
        "Tibb və Sağlamlıq",
        "Mühəndislik",
        "Satış",
        "Marketinq",
        "Təhsil",
        "Müştəri Xidməti",
        "İnsan Resursları",
        "Rəqəmsal Ticarət",
        "Xidmət Sənayesi",
        "Hüquq",
        "Tikinti",
        "Sənaye",
        "Nəqliyyat",
        "İncəsənət və Əyləncə",
        "Yemək Xidməti",
        "İdarəetmə",
        "Elm",
        "Qeyri-Kömək Təşkilatları",
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
        "Abşeron",
        "Ağcabədi",
        "Ağdam",
        "Ağdaş",
        "Ağstafa",
        "Ağsu",
        "Astara",
        "Babək",
        "Bakı",
        "Balakən",
        "Bərdə",
        "Beyləqan",
        "Biləsuvar",
        "Cəbrayıl",
        "Cəlilabad",
        "Culfa",
        "Daşkəsən",
        "Gədəbəy",
        "Gəncə",
        "Goranboy",
        "Göyçay",
        "Göygöl",
        "Hacıqabul",
        "İmişli",
        "İsmayıllı",
        "Kəlbəcər",
        "Kəngərli",
        "Laçın",
        "Lənkəran",
        "Lerik",
        "Masallı",
        "Mingəçevir",
        "Naftalan",
        "Naxçıvan",
        "Neftçala",
        "Oğuz",
        "Ordubad",
        "Qəbələ",
        "Qax",
        "Qazax",
        "Qobustan",
        "Quba",
        "Qubadlı",
        "Qusar",
        "Saatlı",
        "Sabirabad",
        "Salyan",
        "Şamaxı",
        "Şəki",
        "Şəmkir",
        "Şərur",
        "Şuşa",
        "Siazan",
        "Sumqayıt",
        "Tərtər",
        "Tovuz",
        "Ucar",
        "Yardımlı",
        "Yevlax",
        "Yevlax",
        "Zaqatala",
        "Zəngilan",
        "Zərdab",
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
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "12",
        "15",
        "18",
        "20",
        "25",
        "30",
        "50",
        "70",
        "100",
        "150",
        "200",
        "250",
        "300",
        "350",
        "400",
        "450",
        "500",
        "600",
        "700",
        "800",
        "900",
        "1000",
        "1200",
        "1500",
        "2000",
        "2500",
        "3000",
        "3000+",
        "other",
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
