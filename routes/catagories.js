const express = require("express");

const routes = express.Router();

routes.get("/jobCatagories", (req, res) => {
  try {
    res.status(200).json({
      error: false,
      data: [
        "İnformasiya Texnologiyaları,Информационные технологии,Information Technology (IT)",
        "Maliyyə,Финансы,Finance",
        "Tibb və Sağlamlıq,Здравоохранение,Healthcare",
        "Mühəndislik,Инженерия,Engineering",
        "Satış,Продажи,Sales",
        "Marketinq,Маркетинг,Marketing",
        "Təhsil,Образование,Education",
        "Müştəri Xidməti,Обслуживание клиентов,Customer Service",
        "İnsan Resursları,Человеческие ресурсы,Human Resources",
        "Rəqəmsal Ticarət,Цифровая коммерция,Digital Commerce",
        "Xidmət Sənayesi,Сфера услуг,Service Industry",
        "Hüquq,Право,Law",
        "Tikinti,Строительство,Construction",
        "Sənaye,Промышленность,Industry",
        "Nəqliyyat,Транспорт,Transportation",
        "İncəsənət və Əyləncə,Искусство и развлечения,Arts & Entertainment",
        "Yemək Xidməti,Питание,Food Service",
        "İdarəetmə,Управление,Management",
        "Elm,Наука,Science",
        "Qeyri-Kömək Təşkilatları,Некоммерческие организации,Non-Profit Organizations",
        "Digər,Другой,Other",
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
        "Siyəzən,Сиазан,Siyazan",
        "Sumqayıt,Сумгаит,Sumgait",
        "Tərtər,Тертер,Terter",
        "Tovuz,Товуз,Tovuz",
        "Ucar,Уджар,Ujar",
        "Yardımlı,Йардымлы,Yardymly",
        "Yevlax,Евлах,Yevlakh",
        "Zaqatala,Закатала,Zaqatala",
        "Zəngilan,Зангелан,Zangilan",
        "Zərdab,Зардаб,Zardab",
        "Samux,Самух,Samukh",
        "Şahbuz,Шахбуз,Shahbuz",
        "Şirvan,Ширван,Shirvan",
        "Xaçmaz,Хачмаз,Khachmaz",
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
