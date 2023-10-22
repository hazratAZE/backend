const express = require("express");
const {
  getAllJobs,
  createJob,
  getAllMyJobs,
  getOneJob,
} = require("../controllers/jobs");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();
routes.get("/", getAllJobs);
routes.post("/createJob", verifyJwt, createJob);
routes.get("/getAllMyJobs", verifyJwt, getAllMyJobs);
routes.get("/getOneJob", getOneJob);

module.exports = routes;
