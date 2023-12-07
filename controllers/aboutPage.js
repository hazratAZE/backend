const aboutPage = (req, res) => {
  var data;
  const { lang } = req.query;
  if (lang == "en") {
    data = {
      text: "Welcome to Yolu, version 1.0.0—an innovative job-searching application designed to revolutionize the way you explore career opportunities. With an array of cutting-edge functionalities, Yolu empowers users in their quest for the perfect job match.Dynamic Job Listings: Yolu introduces a diverse range of job listings, including full-time, part-time, and daily opportunities, ensuring there's something for every job seeker's preference and availability.Seamless Job Posting: Employers can effortlessly post vacancies, specifying the nature of the job—be it daily tasks or standard employment roles—enabling applicants to find opportunities that align with their schedules.Interactive Map for Recruitment: Yolu incorporates an interactive map feature that enables employers to locate potential candidates nearby, offering job opportunities tailored to their geographic vicinity.User-Friendly Interface: Navigating through Yolu is a breeze, thanks to its intuitive design. The app ensures easy access to a multitude of job options and simplifies the application process for users.Connectivity and Networking: Yolu fosters a vibrant community, facilitating interaction and networking among job seekers and employers. Build connections, exchange information, and enhance your professional network effortlessly.Version 1.0.0 of Yolu marks the beginning of a transformative journey, bridging the gap between job seekers and recruiters with its user-centric approach and innovative features.Download Yolu today and embark on a new era of job searching—a platform designed to cater to your needs, preferences, and aspirations.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    };
  } else if (lang == "az") {
    data = {
      text: "Yolu-ya xoş gəlmisiniz, 1.0.0 versiyası – karyera imkanlarını araşdırmaqda inqilab etmək üçün nəzərdə tutulmuş innovativ iş axtarış proqramı. Bir sıra qabaqcıl funksiyaları ilə Yolu istifadəçilərə mükəmməl iş uyğunluğu axtarışında imkan verir. Dinamik İş Siyahıları: Yolu, tam iş günü, part-time və gündəlik imkanlar da daxil olmaqla müxtəlif iş siyahılarını təqdim edir və orada nəsə olmasını təmin edir. hər bir iş axtaranın üstünlükləri və mövcudluğu üçün. Sorunsuz İş elanı: İşəgötürənlər işin xarakterini - istər gündəlik tapşırıqlar, istərsə də standart məşğulluq rolları - göstərərək, ərizəçilərə öz cədvəllərinə uyğun imkanlar tapmağa imkan verən vakansiyaları asanlıqla yerləşdirə bilər. İşə qəbul üçün interaktiv xəritə: Yolu, işəgötürənlərə yaxınlıqda potensial namizədləri tapmağa imkan verən və onların coğrafi yaxınlığına uyğun iş imkanları təklif edən interaktiv xəritə xüsusiyyətini özündə birləşdirir. İstifadəçi dostu interfeys: Yolu vasitəsilə naviqasiya onun intuitiv dizaynı sayəsində asan olur. Tətbiq çoxlu sayda iş seçimlərinə asan çıxışı təmin edir və istifadəçilər üçün müraciət prosesini asanlaşdırır. Qoşulma və Şəbəkə: Yolu iş axtaranlar və işəgötürənlər arasında qarşılıqlı əlaqəni və şəbəkələşməni asanlaşdıraraq canlı icma yaradır. Əlaqələr qurun, məlumat mübadiləsi aparın və peşəkar şəbəkənizi səylə təkmilləşdirin. Yolu 1.0.0 versiyası istifadəçi mərkəzli yanaşması və innovativ xüsusiyyətləri ilə iş axtaranlar və işə götürənlər arasında uçurumu aradan qaldıraraq transformativ səyahətin başlanğıcını göstərir. Yolu bu gün yükləyin və işə başlayın. iş axtarışının yeni dövründə - ehtiyaclarınıza, seçimlərinizə və arzularınıza cavab vermək üçün hazırlanmış platforma.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    };
  } else {
    data = {
      text: "Добро пожаловать в Yolu версии 1.0.0 — инновационное приложение для поиска работы, призванное радикально изменить ваш подход к поиску возможностей карьерного роста. Благодаря множеству передовых функций Yolu дает пользователям возможность найти идеальную работу. Динамические списки вакансий: Yolu представляет широкий спектр списков вакансий, в том числе на полный рабочий день, неполный рабочий день и ежедневные возможности, гарантируя, что есть что-то. для предпочтений и доступности каждого соискателя. Бесшовное размещение вакансий: работодатели могут легко публиковать вакансии, указывая характер работы — будь то повседневные задачи или стандартные должностные обязанности — что позволяет кандидатам находить возможности, соответствующие их графикам. Интерактивная карта для набора персонала: Yolu включает функцию интерактивной карты, которая позволяет работодателям находить потенциальных кандидатов поблизости, предлагая возможности трудоустройства с учетом их географического расположения. Удобный интерфейс: навигация по Yolu очень проста благодаря интуитивно понятному дизайну. Приложение обеспечивает легкий доступ к множеству вариантов работы и упрощает процесс подачи заявления для пользователей. Связь и создание сетей: Yolu способствует развитию активного сообщества, способствуя взаимодействию и налаживанию связей между соискателями работы и работодателями. Создавайте связи, обменивайтесь информацией и расширяйте свою профессиональную сеть без особых усилий. Версия Yolu 1.0.0 знаменует собой начало преобразующего пути, сокращая разрыв между соискателями работы и рекрутерами благодаря ориентированному на пользователя подходу и инновационным функциям. Загрузите Yolu сегодня и приступайте к работе. о новой эре поиска работы — платформе, созданной для удовлетворения ваших потребностей, предпочтений и стремлений.",
      image: "https://worklytest.s3.eu-north-1.amazonaws.com/image23.png",
    };
  }

  try {
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = { aboutPage };
