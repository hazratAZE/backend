const faqPage = (req, res) => {
  try {
    const { lang } = req.query;
    var data;
    if (lang == "en") {
      data = [
        {
          id: 1,
          question: "Are there any fees for posting an announce?",
          answer: "No. Placing an announce on Yolu program is free.",
        },
        {
          id: 2,
          question: "How do I reset my password?",
          answer:
            "To reset your password, go to the 'Forgot Password' page and follow the instructions.",
        },
        {
          id: 3,
          question: "Is registration required to apply for announcements?",
          answer:
            "Registration is required to apply for daily announcements on the Yolu platform. However, there is no registration requirement for other announcements.",
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
    } else if (lang == "ru") {
      data = [
        {
          id: 1,
          question: "Взимается ли плата за размещение объявления?",
          answer: "Нет. Размещение объявления в программе Yolu бесплатное.",
        },
        {
          id: 2,
          question: "Как сбросить пароль?",
          answer:
            "Чтобы сбросить пароль, перейдите на страницу 'Забыли пароль' и следуйте инструкциям.",
        },
        {
          id: 3,
          question:
            "Требуется ли регистрация для подачи заявки на размещение объявления?",
          answer:
            "Регистрация необходима для подачи заявки на ежедневные объявления на платформе Yolu. Однако для других объявлений регистрация не требуется.",
        },
        {
          id: 4,
          question: "Как связаться с службой поддержки?",
          answer:
            "Вы можете связаться с нашей службой поддержки, позвонив по бесплатному номеру 1-800-123-4567 или отправив письмо на support@example.com.",
        },
        {
          id: 5,
          question: "Какое самое большое млекопитающее в мире?",
          answer: "Самое большое млекопитающее в мире - голубой кит.",
        },
        {
          id: 6,
          question: "Как подписаться на вашу рассылку?",
          answer:
            "Чтобы подписаться на нашу рассылку, посетите наш сайт и введите свой адрес электронной почты в форму подписки.",
        },
        {
          id: 7,
          question: "Какие основные цвета?",
          answer: "Основные цвета - красный, синий и желтый.",
        },
        {
          id: 8,
          question: "Как проверить баланс моего счета?",
          answer:
            "Вы можете проверить баланс своего счета, войдя в свою учетную запись или посетив один из наших банкоматов.",
        },
        {
          id: 9,
          question: "Корень квадратный из 25?",
          answer: "Корень квадратный из 25 равен 5.",
        },
        {
          id: 10,
          question: "Как обновить информацию в моем профиле?",
          answer:
            "Чтобы обновить информацию в вашем профиле, войдите в свою учетную запись и перейдите в раздел 'Профиль', где вы сможете внести необходимые изменения.",
        },
      ];
    } else {
      data = [
        {
          id: 1,
          question: "Elan yerləşdirmək üçün hər hansı ödəniş varmı?",
          answer: "Xeyr. Yolu proqramında elan yerləşdirmək pulsuzdur.",
        },
        {
          id: 2,
          question: "Parolumu necə sıfırlayabilərəm?",
          answer:
            "'Parolunuzu unutmusunuz?' səhifəsinə keçib təlimatları izləyərək parolunuzu sıfırlayabilirsiniz.",
        },
        {
          id: 3,
          question: "Elana müraciət etmək üçün qeydiyyat tələb olunurmu?",
          answer:
            "Yolu platformasında gündəlik elanlara müraciət etmək üçün qeydiyyat tələb olunur. Lakin digər elanlar üçün qeydiyyat tələbi yoxdur.",
        },
        {
          id: 4,
          question: "Müştəri dəstəklə necə əlaqə saxlaya bilərəm?",
          answer:
            "Müştəri dəstəyimizlə pulsuz nömrəmiz olan 1-800-123-4567 zəng edərək və ya support@example.com ünvanına e-poçt göndərərək əlaqə saxlaya bilərsiniz.",
        },
        {
          id: 5,
          question: "Dünyanın ən böyük meməlisi hansıdır?",
          answer: "Dünyanın ən böyük meməlisi mavi balınadır.",
        },
        {
          id: 6,
          question: "Xəbərlərinizə necə abunə oluna bilər?",
          answer:
            "Xəbərlərimizə abunə olmaq üçün veb saytımızı ziyarət edib abunəlik formasına e-poçt ünvanınızı daxil edin.",
        },
        {
          id: 7,
          question: "Əsas rənglər hansılardır?",
          answer: "Əsas rənglər qırmızı, mavi və sarıdır.",
        },
        {
          id: 8,
          question: "Hesabımın balansını necə yoxlaya bilərəm?",
          answer:
            "Hesabınızın balansını hesabınıza daxil olaraq və ya bizim bankomatlarımızdan birinə getməklə yoxlaya bilərsiniz.",
        },
        {
          id: 9,
          question: "25-in kvadrat kökü nədir?",
          answer: "25-in kvadrat kökü 5-dir.",
        },
        {
          id: 10,
          question: "Profil məlumatlarımı necə yeniləyə bilərəm?",
          answer:
            "Profil məlumatlarınızı yeniləmək üçün hesabınıza daxil olun və lazım olan dəyişiklikləri etmək imkanı olan 'Profil' bölməsinə keçin.",
        },
      ];
    }

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
