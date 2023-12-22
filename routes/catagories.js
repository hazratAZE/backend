const express = require("express");

const routes = express.Router();

routes.get("/jobCatagories", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "Information Technology (IT),İnformasiya Texnologiyaları,Информационные технологии",
        "Finance,Maliyyə,Финансы",
        "Healthcare,Tibb və Sağlamlıq,Здравоохранение",
        "Engineering,Mühəndislik,Инженерия",
        "Sales,Satış,Продажи",
        "Marketing,Marketinq,Маркетинг",
        "Education,Təhsil,Образование",
        "Customer Service,Müştəri Xidməti,Обслуживание клиентов",
        "Human Resources,İnsan Resursları,Человеческие ресурсы",
        "Digital Commerce,Rəqəmsal Ticarət,Цифровая коммерция",
        "Service Industry,Xidmət Sənayesi,Сфера услуг",
        "Law,Hüquq,Право",
        "Construction,Tikinti,Строительство",
        "Industry,Sənaye,Промышленность",
        "Transportation,Nəqliyyat,Транспорт",
        "Arts & Entertainment,İncəsənət və Əyləncə,Искусство и развлечения",
        "Food Service,Yemək Xidməti,Питание",
        "Management,İdarəetmə,Управление",
        "Science,Elm,Наука",
        "Non-Profit Organizations,Qeyri-Kömək Təşkilatları,Некоммерческие организации",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/cities", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "Abşeron,Абшерон,Absheron",
        "Ağcabədi,Агджабеди,Aghjabadi",
        "Ağdam,Агдам,Aghdam",
        "Ağdaş,Агдаш,Aghdash",
        "Ağstafa,Агстафа,Aghstafa",
        "Ağsu,Агсу,Aghsu",
        "Astara,Астара,Astara",
        "Babək,Бабек,Babek",
        "Bakı,Баку,Baku",
        "Balakən,Балакен,Balakan",
        "Bərdə,Барда,Barda",
        "Beyləqan,Бейлаган,Beylagan",
        "Biləsuvar,Билясувар,Bilasuvar",
        "Cəbrayıl,Джебраил,Jabrayil",
        "Cəlilabad,Джалилабад,Jalilabad",
        "Culfa,Джульфа,Julfar",
        "Daşkəsən,Дашкесан,Dashkesan",
        "Gədəbəy,Гедабек,Gedabek",
        "Gəncə,Гянджа,Ganja",
        "Goranboy,Горанбой,Goranboy",
        "Göyçay,Гёйчай,Goychay",
        "Göygöl,Гёгель,Goygol",
        "Hacıqabul,Хаджигабул,Khachmaz",
        "İmişli,Имишли,Imishli",
        "İsmayıllı,Исмаиллы,Ismayilli",
        "Kəlbəcər,Кельбаджар,Kelbajar",
        "Kəngərli,Кянкярлы,Kyankyarly",
        "Laçın,Лачин,Lachin",
        "Lənkəran,Ленкорань,Lankaran",
        "Lerik,Лерик,Lerik",
        "Masallı,Масаллы,Masalli",
        "Mingəçevir,Мингячевир,Mingachevir",
        "Naftalan,Нафталан,Naftalan",
        "Naxçıvan,Нахичевань,Nakhchivan",
        "Neftçala,Нефтчала,Neftchala",
        "Oğuz,Огуз,Oguz",
        "Ordubad,Ордубад,Ordubad",
        "Qəbələ,Кабала,Kabala",
        "Qax,Ках,Kakh",
        "Qazax,Газах,Gazakh",
        "Qobustan,Гобустан,Gobustan",
        "Quba,Куба,Kuba",
        "Qubadlı,Кубадлы,Kubadly",
        "Qusar,Кусар,Qusar",
        "Saatlı,Саатлы,Saatly",
        "Sabirabad,Сабирабад,Sabirabad",
        "Salyan,Сальян,Salyan",
        "Şamaxı,Шемаха,Shamakhi",
        "Şəki,Шеки,Sheki",
        "Şəmkir,Шамкир,Shamkir",
        "Şərur,Шарур,Sharur",
        "Şuşa,Шуша,Shusha",
        "Siazan,Сиазан,Siyazan",
        "Sumqayıt,Сумгаит,Sumgait",
        "Tərtər,Тертер,Terter",
        "Tovuz,Товуз,Tovuz",
        "Ucar,Уджар,Ujar",
        "Yardımlı,Йардымлы,Yardymly",
        "Yevlax,Евлах,Yevlakh",
        "Yevlax,Евлах,Yevlakh",
        "Zaqatala,Закатала,Zaqatala",
        "Zəngilan,Зангелан,Zangilan",
        "Zərdab,Зардаб,Zardab",
        "Samukh,Самух,Samukh",
        "Shahbuz,Шахбуз,Shahbuz",
        "Shahdagh,Шахдаг,Shahdagh",
        "Shirvan,Ширван,Shirvan",
        "Khachmaz,Хачмаз,Khachmaz",
        "Xankəndi,Ханкенди,Khankendi",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
routes.get("/salaries", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "1 ₼",
        "2 ₼",
        "3 ₼",
        "4 ₼",
        "5 ₼",
        "6 ₼",
        "7 ₼",
        "8 ₼",
        "9 ₼",
        "10 ₼",
        "12 ₼",
        "15 ₼",
        "18 ₼",
        "20 ₼",
        "25 ₼",
        "30 ₼",
        "50 ₼",
        "70 ₼",
        "100 ₼",
        "150 ₼",
        "200 ₼",
        "250 ₼",
        "300 ₼",
        "350 ₼",
        "400 ₼",
        "450 ₼",
        "500 ₼",
        "600 ₼",
        "700 ₼",
        "800 ₼",
        "900 ₼",
        "1000 ₼",
        "1200 ₼",
        "1500 ₼",
        "2000 ₼",
        "2500 ₼",
        "3000 ₼",
        "3000+ ₼",
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
module.exports = routes;
