const express = require("express");
const { aboutPage } = require("../controllers/aboutPage");
const { faqPage } = require("../controllers/faqPage");
const routes = express.Router();

routes.get("/", aboutPage);
routes.get("/faq", faqPage);

module.exports = routes;
