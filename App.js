const express = require("express");
const dotenv = require("dotenv").config();
const auth = require("./routes/auth");
const init = require("./routes/init");
const catagories = require("./routes/catagories");
const job = require("./routes/job");
const pages = require("./routes/pages");
const news = require("./routes/news");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use("/api/v1/auth/", auth);
app.use("/api/v1/init/", init);
app.use("/api/v1/catagories/", catagories);
app.use("/api/v1/jobs/", job);
app.use("/api/v1/about/", pages);
app.use("/api/v1/news", news);
mongoose
  .connect(process.env.DB_URL)
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.error(err));
