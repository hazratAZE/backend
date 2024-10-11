const story = require("../schemas/story");

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

    // Tüm haberleri ve 'createdBy' alanını aynı sorguda getir
    var allNews = await story.find({ lang: lang }).sort({ createdAt: -1 });
    // sadece name alanını getiriyoruz

    allNews = allNews.map((oneJob) => {
      return {
        ...oneJob._doc,
        trDate: changeDate(oneJob.createdAt, res.__("today")),
      };
    });

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
      return res.status(404).json({
        error: true,
        message: "News not found",
      });
    }

    // İlgili haberi 'createdBy' ile birlikte getiriyoruz
    const myNews = await story.findOne({ _id: id });
    if (!myNews) {
      return res.status(404).json({
        error: true,
        message: "News not found",
      });
    }

    const myNewsTr = {
      ...myNews._doc,
      trDate: changeDate(myNews.createdAt, res.__("today")),
    };

    res.status(200).json({
      error: false,
      data: myNewsTr,
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
    const { title, body, image, lang, source, small_image } = req.body;

    if (!title || !body || !image || !small_image || !lang || !source) {
      return res.status(419).json({
        error: true,
        message: "All fields are required",
      });
    }

    const newNews = new story({
      title,
      body,
      image,
      small_image,
      lang,
      source,
    });

    await newNews.save();
    res.status(201).json({
      error: false,
      data: newNews,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = { getAllNews, createNews, getOneNews };
