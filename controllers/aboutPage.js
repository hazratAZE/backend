const aboutPage = (req, res) => {
  // Tüm dil verilerini tek bir objede topluyoruz
  const langData = {
    en: {
      text: "Welcome to the Yolu platform! Our platform is at your service, designed to bring modern methods to job and employee search. A number of advanced functions open up a wide range of possibilities for you to search for a job or an employee. On our platform, you can easily apply for full-time, part-time, remote and daily job postings. You can also follow users and job postings on the map on our platform and see the postings or employees closest to you. Our main goal is to solve your daily problems quickly and responsibly. It is one of the main issues for us that the platform is free and that all ads have the same status.The platform is very easy to use thanks to its user-friendly interface. The Yolu platform is a local startup project and is updated daily. Thank you for your support and suggestions.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    },
    az: {
      text: "Yolu platformasına xoş gəlmisiniz! İş və işçi axtarışına müasir metodlar gətirmək üçün nəzərdə tutulmuş platformamız xidmətinizdədir. Bir sıra qabaqcıl funksiyalar sizə iş və ya işçi axtarmaq üçün geniş imkanlar açır. Platformamızda siz asanlıqla tam, part-time, uzaqdan və gündəlik iş elanları üçün müraciət edə bilərsiniz. Siz həmçinin istifadəçiləri və iş elanlarını platformamızdakı xəritədə izləyə və sizə ən yaxın elanlara və ya işçilərə baxa bilərsiniz. Əsas məqsədimiz gündəlik problemlərinizi tez və məsuliyyətlə həll etməkdir. Platformanın pulsuz olması və bütün elanların eyni statusda olması bizim üçün əsas məsələlərdən biridir. İstifadəçi dostu interfeysi sayəsində platformadan istifadə etmək çox asandır. Yolu platforması yerli startap layihəsidir və hər gün yenilənir. Dəstəyiniz və təklifləriniz üçün təşəkkür edirik.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    },
    tr: {
      text: "Yolu platformuna hoş geldiniz! Platformumuz, iş ve çalışan aramalarında modern yöntemler sunmak amacıyla hizmetinizdedir. Gelişmiş işlevlerimiz, iş veya çalışan arayışınızda geniş bir imkan yelpazesi sunar. Platformumuzda tam zamanlı, yarı zamanlı, uzaktan ve günlük iş ilanlarına kolayca başvurabilirsiniz. Ayrıca, kullanıcıları ve iş ilanlarını harita üzerinde takip edebilir ve size en yakın ilanları veya çalışanları görebilirsiniz. Ana amacımız günlük sorunlarınızı hızlı ve sorumlu bir şekilde çözmektir. Platformun ücretsiz olması ve tüm ilanların eşit statüde olması bizim için önemli konulardan biridir. Kullanıcı dostu arayüzü sayesinde platform oldukça kolay kullanılmaktadır. Yolu platformu yerel bir girişim projesidir ve günlük olarak güncellenmektedir. Destekleriniz ve önerileriniz için teşekkür ederiz.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    },
    ru: {
      text: "Добро пожаловать на платформу Yolu! К вашим услугам наша платформа, призванная внедрить современные методы поиска работы и сотрудников. Ряд расширенных функций открывают перед вами широкие возможности по поиску работы или сотрудника. На нашей платформе вы можете легко подать заявку на вакансию на полный, неполный рабочий день, удаленно или ежедневно. Вы также можете следить за пользователями и объявлениями о вакансиях на карте на нашей платформе и видеть объявления или ближайших к вам сотрудников. Наша главная цель – быстро и ответственно решать Ваши повседневные проблемы. Для нас одним из главных вопросов является то, что платформа бесплатна и все объявления имеют одинаковый статус.Платформа очень проста в использовании благодаря удобному интерфейсу. Платформа Yolu — это локальный стартап-проект, который обновляется ежедневно. Спасибо за вашу поддержку и предложения.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    },
  };

  const { lang } = req.query;

  // Dil verilerini kontrol edip, varsayılan olarak 'en' dilini kullanıyoruz
  const data = langData[lang] || langData["en"];

  res.status(200).json({
    error: false,
    data: data,
  });
};

module.exports = { aboutPage };
