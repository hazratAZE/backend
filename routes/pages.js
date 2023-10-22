const express = require("express");
const { aboutPage } = require("../controllers/aboutPage");
const { faqPage } = require("../controllers/faqPage");
const { getTerms } = require("../controllers/terms");
const { getCategories } = require("../controllers/getCategories");
const routes = express.Router();

routes.get("/", aboutPage);
routes.get("/faq", faqPage);
routes.get("/terms", getTerms);
routes.get("/getCategories", getCategories);

module.exports = routes;
