const express = require("express");
const appinfo = require("../schemas/comment");

const routes = express.Router();
routes.post("/create", async function (req, res) {
  try {
    const { comment } = req.body;
    if (comment.length < 60) {
      res.status(419).json({
        error: true,
        message: res.__("comment_must_be_at_least"),
      });
    } else {
      const newComment = new appinfo({
        body: comment,
      });
      await newComment.save();
      res.status(200).json({
        error: false,
        data: newComment,
        message: res.__("comment_added_successfully"),
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
module.exports = routes;
