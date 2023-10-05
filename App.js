const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/v1/init", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      message: "App initialization is successful!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "App initialization is unsuccessful!",
    });
  }
});

app.listen(3001, () => {
  console.log("App listening on port 3001");
});
