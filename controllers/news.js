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

    // Tek bir sorgu ile tüm haberleri çekiyoruz
    let allNews = await news.find({ lang }).sort({ createdAt: -1 }).lean();

    // Tüm haberler için tarih formatını dönüştürüyoruz
    allNews = allNews.map((oneNews) => {
      return {
        ...oneNews,
        trDate: changeDate(oneNews.createdAt, res.__("today")),
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

    // lean() ile bellek performansını iyileştiriyoruz
    const myNews = await news.findOne({ _id: id }).lean();

    if (!myNews) {
      return res.status(404).json({
        error: true,
        message: "News not found",
      });
    }

    const myNewsTr = {
      ...myNews,
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
    const { title, body, image, lang, source } = req.body;

    if (!title) {
      return res.status(419).json({
        error: true,
        message: "Title is required",
      });
    }
    if (!body) {
      return res.status(419).json({
        error: true,
        message: "Body is required",
      });
    }
    if (!image) {
      return res.status(419).json({
        error: true,
        message: "Image is required",
      });
    }
    if (!lang) {
      return res.status(419).json({
        error: true,
        message: "Lang is required",
      });
    }
    if (!source) {
      return res.status(419).json({
        error: true,
        message: "Source is required",
      });
    }

    // Yeni haber kaydı oluştur
    const newNews = new news({ title, body, image, lang, source });
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
