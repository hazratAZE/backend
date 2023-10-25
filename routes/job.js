const express = require("express");
const {
  getAllJobs,
  createJob,
  getAllMyJobs,
  getOneJob,
  getOneMyJob,
  updateJobStatus,
  saveJob,
  likeJob,
  reportJob,
} = require("../controllers/jobs");
const { verifyJwt } = require("../middleware/jwt");
const routes = express.Router();
routes.get("/", getAllJobs);
routes.post("/createJob", verifyJwt, createJob);
routes.get("/getAllMyJobs", verifyJwt, getAllMyJobs);
routes.get("/getOneJob", getOneJob);
routes.get("/getOneMyJob", verifyJwt, getOneMyJob);
routes.post("/updateJobStatus", verifyJwt, updateJobStatus);
routes.post("/saveJob", verifyJwt, saveJob);
routes.post("/likeJob", verifyJwt, likeJob);
routes.post("/reportJob", verifyJwt, reportJob);

module.exports = routes;
