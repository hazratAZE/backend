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

module.exports = routes;
