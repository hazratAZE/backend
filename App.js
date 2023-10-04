const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    hello: "king is back",
  });
});

app.listen(3001, () => {
  console.log("App listening on port 3001");
});
