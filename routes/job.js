const express = require("express");
const { getAllJobs, createJob, getAllMyJobs } = require("../controllers/jobs");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();
routes.get("/", getAllJobs);
routes.post("/createJob", verifyJwt, createJob);
routes.get("/getAllMyJobs", verifyJwt, getAllMyJobs);

module.exports = routes;
