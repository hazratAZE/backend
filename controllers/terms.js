const getTerms = (req, res) => {
  try {
    const { lang } = req.query;
    var data;
    if (lang == "en") {
      data = `Terms and Conditions of Yolu App

      Welcome to Yolu, a job-searching application designed to connect job seekers with employment opportunities. By using the Yolu app, you agree to the following terms and conditions:
      
      1. User Responsibilities
      
      a. You must provide accurate and updated information when creating your profile or applying for jobs on Yolu.
      
      b. You are responsible for maintaining the confidentiality of your account login credentials.
      
      c. Users must comply with all applicable laws and regulations while using the app.
      
      2. Job Listings and Applications
      
      a. Yolu provides job listings as a service but does not guarantee the accuracy or availability of listed positions.
      
      b. Applying for jobs through Yolu does not guarantee employment, and Yolu is not liable for the hiring decisions made by employers.
      
      3. Content Guidelines
      
      a. Users are responsible for the content they post, ensuring it complies with community guidelines and does not contain offensive, misleading, or unlawful material.
      
      b. Yolu reserves the right to remove or modify content that violates these guidelines without notice.
      
      4. Data Privacy and Security
      
      a. Yolu respects user privacy and handles personal information in accordance with its Privacy Policy.
      
      b. Users are responsible for safeguarding their personal data and should report any security concerns or unauthorized access.
      
      5. Intellectual Property
      
      a. Yolu retains ownership of all intellectual property rights associated with the app.
      
      b. Users must not reproduce, distribute, or modify Yolu's proprietary content without permission.
      
      6. Limitation of Liability
      
      a. Yolu is not liable for any direct or indirect damages, including but not limited to loss of data, profits, or business opportunities arising from app usage.
      
      b. Yolu is not responsible for the actions or conduct of users or third-party content on the app.
      
      7. Modifications to Terms
      
      a. Yolu reserves the right to update or modify these terms and conditions at any time without prior notice.
      
      b. Continued use of the app after modifications implies acceptance of the updated terms.
      
      8. Termination
      
      a. Yolu may terminate or suspend user accounts for violations of these terms or for any other reason deemed necessary.
      
      b. Users can deactivate or delete their accounts by following the app's provided instructions.
      
      By using the Yolu app, you agree to abide by these terms and conditions. If you do not agree, please refrain from using the app.`;
    } else if (lang == "ru") {
      data = `Условия использования приложения Yolu

      Добро пожаловать в Yolu, приложение для поиска работы, предназначенное для того, чтобы связать соискателей с возможностями трудоустройства. Используя приложение Yolu, вы соглашаетесь со следующими условиями:
      
      1. Обязанности пользователя
      
      а. Вы должны предоставить точную и обновленную информацию при создании своего профиля или подаче заявки на работу на Yolu.
      
      б. Вы несете ответственность за сохранение конфиденциальности учетных данных для входа в вашу учетную запись.
      
      в. Пользователи должны соблюдать все применимые законы и правила при использовании приложения.
      
      2. Списки вакансий и заявления
      
      а. Yolu предоставляет списки вакансий в качестве услуги, но не гарантирует точность или доступность перечисленных вакансий.
      
      б. Подача заявления о приеме на работу через Yolu не гарантирует трудоустройство, и Yolu не несет ответственности за решения о найме, принятые работодателями.
      
      3. Рекомендации по содержанию
      
      а. Пользователи несут ответственность за публикуемый ими контент, обеспечивая его соответствие принципам сообщества и отсутствие оскорбительных, вводящих в заблуждение или незаконных материалов.
      
      б. Yolu оставляет за собой право удалять или изменять контент, нарушающий эти правила, без предварительного уведомления.
      
      4. Конфиденциальность и безопасность данных
      
      а. Yolu уважает конфиденциальность пользователей и обрабатывает личную информацию в соответствии со своей Политикой конфиденциальности.
      
      б. Пользователи несут ответственность за защиту своих личных данных и должны сообщать о любых проблемах безопасности или несанкционированном доступе.
      
      5. Интеллектуальная собственность
      
      а. Yolu сохраняет за собой все права интеллектуальной собственности, связанные с приложением.
      
      б. Пользователи не должны воспроизводить, распространять или изменять собственный контент Yolu без разрешения.
      
      6. Ограничение ответственности
      
      а. Yolu не несет ответственности за любой прямой или косвенный ущерб, включая, помимо прочего, потерю данных, прибыли или деловых возможностей, возникающих в результате использования приложения.
      
      б. Yolu не несет ответственности за действия или поведение пользователей или сторонний контент в приложении.
      
      7. Изменения в Условиях
      
      а. Yolu оставляет за собой право обновлять или изменять эти условия в любое время без предварительного уведомления.
      
      б. Продолжение использования приложения после внесения изменений подразумевает принятие обновленных условий.
      
      8. Прекращение действия
      
      а. Yolu может прекратить или приостановить действие учетных записей пользователей за нарушение настоящих условий или по любой другой причине, которую сочтет необходимой.
      
      б. Пользователи могут деактивировать или удалить свои учетные записи, следуя инструкциям приложения.
      
      Используя приложение Yolu, вы соглашаетесь соблюдать эти условия. Если вы не согласны, пожалуйста, воздержитесь от использования приложения.`;
    } else {
      data = `Yolu Tətbiqinin Qaydaları və Şərtləri

      İş axtaranları məşğulluq imkanları ilə əlaqələndirmək üçün nəzərdə tutulmuş iş axtarış proqramı olan Yolu-ya xoş gəlmisiniz. Yolu tətbiqindən istifadə etməklə siz aşağıdakı şərtlərlə razılaşırsınız:
      
      1. İstifadəçinin Məsuliyyətləri
      
      a. Profilinizi yaratarkən və ya Yolu-da iş üçün müraciət edərkən dəqiq və yenilənmiş məlumatları təqdim etməlisiniz.
      
      b. Siz hesabınıza giriş məlumatlarınızın məxfiliyinin qorunmasına cavabdehsiniz.
      
      c. İstifadəçilər tətbiqdən istifadə edərkən bütün qüvvədə olan qanun və qaydalara əməl etməlidirlər.
      
      2. İş siyahıları və ərizələr
      
      a. Yolu bir xidmət kimi iş siyahıları təqdim edir, lakin sadalanan vəzifələrin düzgünlüyünə və ya mövcudluğuna zəmanət vermir.
      
      b. Yolu vasitəsilə iş üçün müraciət etmək işə zəmanət vermir və Yolu işəgötürənlər tərəfindən verilən işə qəbul qərarlarına görə məsuliyyət daşımır.
      
      3. Məzmun Təlimatları
      
      a. İstifadəçilər dərc etdikləri məzmuna görə məsuliyyət daşıyırlar, onun icma qaydalarına uyğun olmasını və təhqiredici, aldadıcı və ya qeyri-qanuni materialları ehtiva etməməsini təmin edirlər.
      
      b. Yolu xəbərdarlıq etmədən bu qaydaları pozan məzmunu silmək və ya dəyişdirmək hüququnu özündə saxlayır.
      
      4. Məlumat Məxfiliyi və Təhlükəsizliyi
      
      a. Yolu istifadəçi məxfiliyinə hörmət edir və şəxsi məlumatı Məxfilik Siyasətinə uyğun olaraq idarə edir.
      
      b. İstifadəçilər şəxsi məlumatlarının qorunmasına cavabdehdirlər və hər hansı təhlükəsizlik narahatlığı və ya icazəsiz giriş barədə məlumat verməlidirlər.
      
      5. Əqli Mülkiyyət
      
      a. Yolu proqramla əlaqəli bütün əqli mülkiyyət hüquqlarının sahibliyini özündə saxlayır.
      
      b. İstifadəçilər icazəsiz Yolu-nun mülkiyyət məzmununu çoxaltmamalı, yaymamalı və ya dəyişdirməməlidir.
      
      6. Məsuliyyətin məhdudlaşdırılması
      
      a. Yolu tətbiqin istifadəsi nəticəsində yaranan məlumatların, mənfəətlərin və ya biznes imkanlarının itirilməsi daxil olmaqla, lakin bununla məhdudlaşmayan hər hansı birbaşa və ya dolayı zərərə görə məsuliyyət daşımır.
      
      b. Yolu istifadəçilərin hərəkətlərinə və ya davranışlarına və ya tətbiqdəki üçüncü tərəf məzmununa görə məsuliyyət daşımır.
      
      7. Şərtlərə Dəyişikliklər
      
      a. Yolu istənilən vaxt əvvəlcədən xəbərdarlıq etmədən bu şərtləri yeniləmək və ya dəyişdirmək hüququnu özündə saxlayır.
      
      b. Dəyişikliklərdən sonra tətbiqdən istifadənin davam etdirilməsi yenilənmiş şərtlərin qəbul edilməsini nəzərdə tutur.
      
      8. Xitam
      
      a. Yolu bu şərtlərin pozulmasına görə və ya zəruri hesab edilən hər hansı digər səbəbdən istifadəçi hesablarını dayandıra və ya dayandıra bilər.
      
      b. İstifadəçilər proqramın təqdim etdiyi təlimatlara əməl etməklə hesablarını deaktiv edə və ya silə bilərlər.
      
      Yolu proqramından istifadə etməklə siz bu şərtlərə əməl etməyə razısınız. Razı deyilsinizsə, proqramdan istifadə etməkdən çəkinin.`;
    }

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
module.exports = { getTerms };
