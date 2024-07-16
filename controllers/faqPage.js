const faqPage = (req, res) => {
  try {
    const { lang } = req.query;
    var data;
    if (lang == "en") {
      data = [
        {
          id: 1,
          question: "Are there any fees for posting an announcement?",
          answer:
            "You can use the tokens on the platform to place an announcement on the Yolu platform.",
        },
        {
          id: 2,
          question: "What types of jobs are available on Yolu?",
          answer:
            "Yolu has four types of job postings. Daily, Full-time, Part-Time, Remote.",
        },
        {
          id: 3,
          question: "Is registration required to apply for announcements?",
          answer:
            "You must register to apply for a job advertisement on the Yolu platform.",
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
          question:
            "Can I receive notifications for new job postings that match my preferences?",
          answer:
            "You will be able to receive notifications about vacancies added according to your section.",
        },
        {
          id: 9,
          question: "Is Yolu available in multiple languages?",
          answer:
            "Three languages are available in the Yolu program: Azerbaijani, Russian, English.",
        },
      ];
    } else if (lang == "ru") {
      data = [
        {
          id: 1,
          question: "Взимается ли плата за размещение объявления?",
          answer:
            "Вы можете использовать токены на платформе для размещения объявлений на платформе Yolu.",
        },
        {
          id: 2,
          question: "Какие типы вакансий доступны на Yolu?",
          answer:
            "В Yolu есть четыре типа объявлений о вакансиях. Ежедневно, Полная занятость, Частичная занятость, Удаленно.",
        },
        {
          id: 3,
          question:
            "Требуется ли регистрация для подачи заявки на размещение объявления?",
          answer:
            "Вы должны зарегистрироваться, чтобы подать заявку на объявление о работе на платформе Yolu.",
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
          question:
            "Могу ли я получать уведомления о новых объявлениях о вакансиях, соответствующих моим предпочтениям?",
          answer:
            "Вы сможете получать уведомления о вакансиях, добавленных в соответствии с вашим разделом.",
        },
        {
          id: 9,
          question: "Доступен ли Yolu на нескольких языках?",
          answer:
            "В программе Yolu доступны три языка: Азербайджанский, Русский, Английский.",
        },
      ];
    } else {
      data = [
        {
          id: 1,
          question: "Elan yerləşdirmək üçün hər hansı ödəniş varmı?",
          answer:
            "Yolu platformasında elan yerləşdirmək üçün platformada istifadə olunan tokenlərdən istifadə edə bilərsiniz.",
        },
        {
          id: 2,
          question: "Yolu-da hansı iş növləri mövcuddur?",
          answer:
            "Yolu-da dörd növ iş elanı var. Gündəlik, Tam iş günü, Part-Time, Uzaqdan.",
        },
        {
          id: 3,
          question: "Elana müraciət etmək üçün qeydiyyat tələb olunurmu?",
          answer:
            "Yolu platformasında iş elanına müraciət etmək üçün qeydiyyatdan keçməlisiniz.",
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
          question:
            "Tercihlərimə uyğun gələn yeni iş elanları üçün bildirişlər ala bilərəmmi?",
          answer:
            "Bölmənizə uyğun olaraq əlavə edilmiş vakansiyalar haqqında bildirişlər ala biləcəksiniz.",
        },
        {
          id: 9,
          question: "Yolu bir neçə dildə mövcuddur?",
          answer:
            "Yolu proqramında üç dil mövcuddur: Azərbaycan, Rus, İngilis.",
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
