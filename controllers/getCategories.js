const getCategories = (req, res) => {
  try {
    const categories = [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Daily",
      },
      {
        id: 3,
        name: "Full-Time",
      },
      {
        id: 4,
        name: "Part-Time",
      },
      {
        id: 5,
        name: "Remote",
      },
    ];
    res.status(200).json({
      error: false,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = { getCategories };
