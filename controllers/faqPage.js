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
          question: "What types of jobs are available on Yolu?",
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
            "You can contact our customer support team by calling our toll-free number at +994(70)811 74 34 or by sending an email to hazratqafo@gmail.com.",
        },
        {
          id: 5,
          question: "How often are new job listings posted on the app?",
          answer: "Job postings are updated based on user activity.",
        },
        {
          id: 6,
          question: "Can I search for specific job categories?",
          answer:
            "Yes. You can search for the job category you want. For this, visit the search page.",
        },
        {
          id: 7,
          question: "Can I save jobs to apply to later?",
          answer:
            "Yes. You can save announcements  that you want to apply to later.",
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
          question: "Какие типы вакансий доступны на Yolu?",
          answer:
            "На дороге есть четыре типа объявлений о вакансиях. Ежедневно, полная занятость, частичная занятость, удаленно.",
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
            "Вы можете связаться с нашей службой поддержки, позвонив по бесплатному номеру +994(70)811 74 34 или отправив письмо на hazratqafo@gmail.com.",
        },
        {
          id: 5,
          question: "Как часто в приложении публикуются новые списки вакансий?",
          answer:
            "Объявления о вакансиях обновляются в зависимости от активности пользователей.",
        },
        {
          id: 6,
          question: "Могу ли я искать конкретные категории вакансий?",
          answer:
            "Да. Вы можете найти нужную вам категорию вакансий. Для этого посетите страницу поиска.",
        },
        {
          id: 7,
          question: "Могу ли я сохранить вакансии, чтобы подать заявку позже?",
          answer:
            "Да. Вы можете сохранить объявления, к которым хотите применить позже.",
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
          question: "Yolu-da hansı iş növləri mövcuddur?",
          answer:
            "Yolda dörd növ iş elanı var. Gündəlik, Tam iş günü, Part-Time, Uzaqdan.",
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
            "Müştəri dəstəyimizlə pulsuz nömrəmiz olan +994(70)811 74 34 zəng edərək və ya hazratqafo@gmail.com ünvanına e-poçt göndərərək əlaqə saxlaya bilərsiniz.",
        },
        {
          id: 5,
          question: "Yeni iş elanları tətbiqdə nə qədər tez-tez dərc olunur?",
          answer: "İş elanları istifadəçi fəaliyyətinə əsasən yenilənir.",
        },
        {
          id: 6,
          question: "Xüsusi iş kateqoriyaları üçün axtarış edə bilərəmmi?",
          answer:
            "Bəli. İstədiyiniz iş kateqoriyasını axtara bilərsiniz. Bunun üçün axtarış səhifəsinə daxil olun.",
        },
        {
          id: 7,
          question: "Daha sonra müraciət etmək üçün işləri saxlaya bilərəmmi?",
          answer:
            "Bəli. Daha sonra müraciət etmək istədiyiniz elanları saxlaya bilərsiniz.",
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
