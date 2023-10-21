const faqPage = (req, res) => {
  try {
    const data = [
      {
        id: 1,
        question: "What is the capital of France?",
        answer: "The capital of France is Paris.",
      },
      {
        id: 2,
        question: "How do I reset my password?",
        answer:
          "To reset your password, go to the 'Forgot Password' page and follow the instructions.",
      },
      {
        id: 3,
        question: "What is the meaning of life?",
        answer:
          "The meaning of life is a philosophical question with no definitive answer. It varies from person to person.",
      },
      {
        id: 4,
        question: "How can I contact customer support?",
        answer:
          "You can contact our customer support team by calling our toll-free number at 1-800-123-4567 or by sending an email to support@example.com.",
      },
      {
        id: 5,
        question: "What is the largest mammal in the world?",
        answer: "The largest mammal in the world is the blue whale.",
      },
      {
        id: 6,
        question: "How can I subscribe to your newsletter?",
        answer:
          "To subscribe to our newsletter, visit our website and enter your email address in the subscription form.",
      },
      {
        id: 7,
        question: "What are the primary colors?",
        answer: "The primary colors are red, blue, and yellow.",
      },
      {
        id: 8,
        question: "How do I check my account balance?",
        answer:
          "You can check your account balance by logging into your account or by visiting one of our ATMs.",
      },
      {
        id: 9,
        question: "What is the square root of 25?",
        answer: "The square root of 25 is 5.",
      },
      {
        id: 10,
        question: "How do I update my profile information?",
        answer:
          "To update your profile information, log into your account and go to the 'Profile' section where you can make the necessary changes.",
      },
    ];
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
  }
};
module.exports = { faqPage };
