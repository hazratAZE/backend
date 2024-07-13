const news = require("../schemas/news");

const changeDate = (backendTime, newDate) => {
  // Get today's date
  const today = new Date();
  const backendDate = new Date(backendTime);
  // Check if the parsed date is today
  if (
    backendDate.getDate() === today.getDate() &&
    backendDate.getMonth() === today.getMonth() &&
    backendDate.getFullYear() === today.getFullYear()
  ) {
    // Format the time as "hh:mm"
    const formattedTime =
      backendDate.getHours().toString().padStart(2, "0") +
      ":" +
      backendDate.getMinutes().toString().padStart(2, "0");

    // Create the user-friendly time format
    const userFriendlyTime = `${newDate} ${formattedTime}`;

    // userFriendlyTime now contains the desired format, e.g., "today 09:26"
    return userFriendlyTime;
  } else {
    // If the date is not today, you can handle it accordingly, e.g., display the full date.
    const userFriendlyDate = backendDate.toLocaleDateString();
    return userFriendlyDate;
  }
};
const getAllNews = async (req, res) => {
  try {
    const { lang } = req.query;
    var allNews = await news.find({ lang: lang }).sort({ createdAt: -1 });
    allNews = await Promise.all(
      allNews.map(async (oneJob) => {
        try {
          allNews = await news.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            trDate: changeDate(oneJob.createdAt, res.__("today")),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
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
const getOneNews = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(404).json({
        error: true,
        message: "News not found",
      });
    } else {
      const myNews = await news.findOne({ _id: id });
      const myNewsTr = {
        ...myNews._doc,
        trDate: changeDate(myNews.createdAt, res.__("today")),
      };
      res.status(200).json({
        error: false,
        data: myNewsTr,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const createNews = async (req, res) => {
  try {
    const { title, body, image, lang, source } = req.body;
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
    } else if (!lang) {
      res.status(419).json({
        error: true,
        message: "Lang is required",
      });
    } else if (!source) {
      res.status(419).json({
        error: true,
        message: "Source is required",
      });
    } else {
      const newNews = new news({
        title: title,
        body: body,
        image: image,
        lang: lang,
        source: source,
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
module.exports = { getAllNews, createNews, getOneNews };
