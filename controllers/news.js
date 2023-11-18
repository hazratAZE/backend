const news = require("../schemas/news");

const getAllNews = async (req, res) => {
  try {
    const allNews = await news.find().sort({ createdAt: -1 });
    res.status(200).json({
      error: false,
      data: allNews,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const createNews = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    if (!title) {
      res.status(419).json({
        error: true,
        message: "Title is required",
      });
    } else if (!body) {
      res.status(419).json({
        error: true,
        message: "Body is required",
      });
    } else if (!image) {
      res.status(419).json({
        error: true,
        message: "Image is required",
      });
    } else {
      const newNews = new news({
        title: title,
        body: body,
        image: image,
      });
      await newNews.save();
      res.status(201).json({
        error: false,
        data: newNews,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = { getAllNews, createNews };
