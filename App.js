const express = require("express");
const dotenv = require("dotenv").config();
const auth = require("./routes/auth");
const init = require("./routes/init");
const catagories = require("./routes/catagories");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use("/api/v1/auth/", auth);
app.use("/api/v1/init/", init);
app.use("/api/v1/catagories/", catagories);
mongoose
  .connect(process.env.DB_URL)
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.error(err));
