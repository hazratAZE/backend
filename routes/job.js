const express = require("express");
const { getAllJobs, createJob } = require("../controllers/jobs");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();
routes.get("/", getAllJobs);
routes.post("/createJob", verifyJwt, createJob);
module.exports = routes;
