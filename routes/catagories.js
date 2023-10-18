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
        { id: 1, name: "Abşeron" },
        { id: 2, name: "Ağdam" },
        { id: 3, name: "Ağdaş" },
        { id: 4, name: "Ağcabədi" },
        { id: 5, name: "Ağstafa" },
        { id: 6, name: "Ağsu" },
        { id: 7, name: "Astara" },
        { id: 8, name: "Babək" },
        { id: 9, name: "Balakən" },
        { id: 10, name: "Bərdə" },
        { id: 11, name: "Beyləqan" },
        { id: 12, name: "Biləsuvar" },
        { id: 13, name: "Daşkəsən" },
        { id: 14, name: "Gədəbəy" },
        { id: 15, name: "Goranboy" },
        { id: 16, name: "Göyçay" },
        { id: 17, name: "Göygöl" },
        { id: 18, name: "Hacıqabul" },
        { id: 19, name: "İmişli" },
        { id: 20, name: "İsmayıllı" },
        { id: 21, name: "Cəbrayıl" },
        { id: 22, name: "Cəlilabad" },
        { id: 23, name: "Culfa" },
        { id: 24, name: "Kəlbəcər" },
        { id: 25, name: "Kəngərli" },
        { id: 26, name: "Xaçmaz" },
        { id: 27, name: "Xanlar" },
        { id: 28, name: "Laçın" },
        { id: 29, name: "Lənkəran" },
        { id: 30, name: "Lerik" },
        { id: 31, name: "Masallı" },
        { id: 32, name: "Mingəçevir" },
        { id: 33, name: "Naftalan" },
        { id: 34, name: "Naxçıvan" },
        { id: 35, name: "Neftçala" },
        { id: 36, name: "Oğuz" },
        { id: 37, name: "Ordubad" },
        { id: 38, name: "Qəbələ" },
        { id: 39, name: "Qax" },
        { id: 40, name: "Qazax" },
        { id: 41, name: "Qobustan" },
        { id: 42, name: "Quba" },
        { id: 43, name: "Qubadlı" },
        { id: 44, name: "Qusar" },
        { id: 45, name: "Saatlı" },
        { id: 46, name: "Sabirabad" },
        { id: 47, name: "Salyan" },
        { id: 48, name: "Şamaxı" },
        { id: 49, name: "Şəki" },
        { id: 50, name: "Şəmkir" },
        { id: 51, name: "Şərur" },
        { id: 52, name: "Şuşa" },
        { id: 53, name: "Siazan" },
        { id: 54, name: "Sumqayıt" },
        { id: 55, name: "Tərtər" },
        { id: 56, name: "Tovuz" },
        { id: 57, name: "Ucar" },
        { id: 58, name: "Yardımlı" },
        { id: 59, name: "Yevlax" },
        { id: 60, name: "Yevlax" },
        { id: 61, name: "Zəngilan" },
        { id: 62, name: "Zaqatala" },
        { id: 63, name: "Zərdab" },
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
