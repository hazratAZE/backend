const express = require("express");

const routes = express.Router();

routes.get("/jobCatagories", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        { id: 1, category: "İnformasiya Texnologiyaları (IT)" },
        { id: 2, category: "Maliyyə" },
        { id: 3, category: "Tibb və Sağlamlıq" },
        { id: 4, category: "Mühəndislik" },
        { id: 5, category: "Satış" },
        { id: 6, category: "Marketinq" },
        { id: 7, category: "Təhsil" },
        { id: 8, category: "Müştəri Xidməti" },
        { id: 9, category: "İnsan Resursları" },
        { id: 10, category: "Rəqəmsal Ticarət" },
        { id: 11, category: "Xidmət Sənayesi" },
        { id: 12, category: "Hüquq" },
        { id: 13, category: "Tikinti" },
        { id: 14, category: "Sənaye" },
        { id: 15, category: "Nəqliyyat" },
        { id: 16, category: "İncəsənət və Əyləncə" },
        { id: 17, category: "Yemək Xidməti" },
        { id: 18, category: "İdarəetmə" },
        { id: 19, category: "Elm" },
        { id: 20, category: "Qeyri-Kömək Təşkilatları" },
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
routes.get("/salaries", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        { id: 1, range: "0-50" },
        { id: 2, range: "50-100" },
        { id: 3, range: "100-200" },
        { id: 4, range: "200-500" },
        { id: 5, range: "500-700" },
        { id: 6, range: "700-1000" },
        { id: 7, range: "1000-1500" },
        { id: 8, range: "1500-2000" },
        { id: 9, range: "2000-3000" },
        { id: 10, range: "3000-5000" },
        { id: 11, range: "5000+" }, // For "more than 5000"
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
