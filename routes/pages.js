const express = require("express");
const { aboutPage } = require("../controllers/aboutPage");
const { faqPage } = require("../controllers/faqPage");
const { getTerms } = require("../controllers/terms");
const routes = express.Router();

routes.get("/", aboutPage);
routes.get("/faq", faqPage);
routes.get("/terms", getTerms);

module.exports = routes;
