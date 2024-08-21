const job = require("../schemas/job");
const user = require("../schemas/user");
const schedule = require("node-schedule");
var FCM = require("fcm-node");
const { createNotification } = require("./notifications");
var validator = require("email-validator");
const nodemailer = require("nodemailer");
var serverKey = process.env.MY_SERVER_KEY; //put your server key here
var fcm = new FCM(serverKey);
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const getAllJobsAdmin = async (req, res) => {
  try {
    let allJobsQuery = job.find().sort({ createdAt: -1 });
    let allJobs = await allJobsQuery;

    res.status(200).json({
      error: false,
      data: allJobs,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const reActiveJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;

    if (!email) {
      res.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });

      if (!myUser) {
        res.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        const currentJob = await job.findOne({ _id: id });
        if (!currentJob) {
          res.status(404).json({
            error: true,
            message: "Job not found",
          });
        } else {
          await job.updateOne({ _id: id }, { status: "pending" });
          const myJob = await job.findOne({ _id: id });

          res.status(200).json({
            error: false,
            data: myJob,
            message: res.__("announce_status_updated"),
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const checkJob = async (req, res) => {
  try {
    const { id, userId, status, category } = req.body;
    const newJob = await job.findOne({ _id: id });
    if (status == "accept") {
      newJob.status = "active";
      await newJob.save();
      console.log(newJob);
      const myUser = await user.findOne({ _id: userId });
      sendPushNotification(
        myUser.fcmToken,
        "Hörmətli istifadəçi, elanınız uğurla yayımlandı 🎉",
        `${newJob.title}, ${newJob.salary}, ${newJob.type}, ${newJob.location}, ${newJob.description}
    `,
        "info",
        myUser._id,
        "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
        "noemail"
      );
      const userList = await user.find({ jobCategory: category });
      const notification = await createNotification(
        "addedJob",
        `${myUser.name} ${myUser.surname}`,
        "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
        myUser._id,
        "addedJob"
      );
      myUser.notifications.push(notification);
      await myUser.save();
      userList.forEach(async (one) => {
        // Check if the user ID matches the ID of the user who created the job
        if (one._id.toString() !== myUser._id.toString()) {
          await sendPushNotification(
            one.fcmToken,
            "Sizin sahenize uygun yeni is elani! ✅",
            `${newJob.title}, ${newJob.salary}, ${newJob.type}, ${newJob.location}, ${newJob.description}
    `,
            "info",
            one._id,
            "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
            "noemail"
          );
        }
      });
    } else {
      newJob.status = "rejected";
      await newJob.save();
      const myUser = await user.findOne({ _id: userId });
      console.log(myUser);
      sendPushNotification(
        myUser.fcmToken,
        "Elanınız dərc edilmədi! ❌",
        `Hörmətli istifadəçi, təəssüf ki, elanınızı dərc edə bilmədik. Təlimatları diqqətlə oxuyun və yenidən cəhd edin
      `,
        "info",
        myUser._id,
        "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
        "noemail"
      );

      const notification = await createNotification(
        "rejectJob",
        `${myUser.name} ${myUser.surname}`,
        "https://worklytest.s3.eu-north-1.amazonaws.com/appiconyolu.png",
        myUser._id,
        "rejectJob"
      );
      myUser.notifications.push(notification);
      await myUser.save();
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getAllJobs = async (req, res) => {
  try {
    // Define a filter object based on query parameters
    const filter = {
      status: "active",
    };
    var jobs;
    const { typing, limit, rating, lang } = req.query;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.salary) filter.salary = req.query.salary;
    if (req.query.category) filter.category = req.query.category;

    let allJobsQuery = rating
      ? job.find(filter).sort({ rating: -1 })
      : job.find(filter).sort({ createdAt: -1 });

    let allJobs = await allJobsQuery;

    if (req.query.typing) {
      allJobs = allJobs.filter((oneJob) =>
        oneJob.title.toLocaleLowerCase().includes(typing)
      );
    }

    const page = parseInt(req.query.page) || 1;
    const endIndex = page * limit;

    allJobs = allJobs.slice(0, endIndex);

    if (req.query.email) {
      const myUser = await user.findOne({ email: req.query.email });
      jobs = await Promise.all(
        allJobs.map(async (oneJob) => {
          try {
            return {
              ...oneJob._doc,
              savedJob: myUser.savedJobs.includes(oneJob._id),
              likedJob: myUser.likedJobs.includes(oneJob._id),
              trCity:
                oneJob.city == "Absheron"
                  ? res.__("absheron")
                  : oneJob.city == "Aghjabadi"
                  ? res.__("aghjabadi")
                  : oneJob.city == "Aghdam"
                  ? res.__("aghdam")
                  : oneJob.city == "Aghdash"
                  ? res.__("aghdash")
                  : oneJob.city == "Aghstafa"
                  ? res.__("aghstafa")
                  : oneJob.city == "Aghsu"
                  ? res.__("aghsu")
                  : oneJob.city == "Astara"
                  ? res.__("astara")
                  : oneJob.city == "Babek"
                  ? res.__("babek")
                  : oneJob.city == "Baku"
                  ? res.__("baku")
                  : oneJob.city == "Balakan"
                  ? res.__("balakan")
                  : oneJob.city == "Barda"
                  ? res.__("barda")
                  : oneJob.city == "Beylagan"
                  ? res.__("beylagan")
                  : oneJob.city == "Bilasuvar"
                  ? res.__("bilasuvar")
                  : oneJob.city == "Jabrayil"
                  ? res.__("jabrayil")
                  : oneJob.city == "Jalilabad"
                  ? res.__("jalilabad")
                  : oneJob.city == "Julfar"
                  ? res.__("julfar")
                  : oneJob.city == "Dashkesan"
                  ? res.__("dashkesan")
                  : oneJob.city == "Gedabek"
                  ? res.__("gedabek")
                  : oneJob.city == "Ganja"
                  ? res.__("ganja")
                  : oneJob.city == "Goranboy"
                  ? res.__("goranboy")
                  : oneJob.city == "Goychay"
                  ? res.__("goychay")
                  : oneJob.city == "Goygol"
                  ? res.__("goygol")
                  : oneJob.city == "Khachmaz"
                  ? res.__("khachmaz")
                  : oneJob.city == "Imishli"
                  ? res.__("imishli")
                  : oneJob.city == "Ismayilli"
                  ? res.__("ismayilli")
                  : oneJob.city == "Kelbajar"
                  ? res.__("kelbajar")
                  : oneJob.city == "Lachin"
                  ? res.__("lachin")
                  : oneJob.city == "Lankaran"
                  ? res.__("lankaran")
                  : oneJob.city == "Lerik"
                  ? res.__("lerik")
                  : oneJob.city == "Masalli"
                  ? res.__("masalli")
                  : oneJob.city == "Mingachevir"
                  ? res.__("mingachevir")
                  : oneJob.city == "Naftalan"
                  ? res.__("naftalan")
                  : oneJob.city == "Nakhchivan"
                  ? res.__("nakhchivan")
                  : oneJob.city == "Neftchala"
                  ? res.__("neftchala")
                  : oneJob.city == "Oguz"
                  ? res.__("oguz")
                  : oneJob.city == "Ordubad"
                  ? res.__("ordubad")
                  : oneJob.city == "Kabala"
                  ? res.__("kabala")
                  : oneJob.city == "Kakh"
                  ? res.__("kakh")
                  : oneJob.city == "Gazakh"
                  ? res.__("gazakh")
                  : oneJob.city == "Gobustan"
                  ? res.__("gobustan")
                  : oneJob.city == "Kuba"
                  ? res.__("kuba")
                  : oneJob.city == "Kubadly"
                  ? res.__("kubadly")
                  : oneJob.city == "Qusar"
                  ? res.__("qusar")
                  : oneJob.city == "Saatly"
                  ? res.__("saatly")
                  : oneJob.city == "Sabirabad"
                  ? res.__("sabirabad")
                  : oneJob.city == "Salyan"
                  ? res.__("salyan")
                  : oneJob.city == "Shamakhi"
                  ? res.__("shamakhi")
                  : oneJob.city == "Sheki"
                  ? res.__("sheki")
                  : oneJob.city == "Shamkir"
                  ? res.__("shamkir")
                  : oneJob.city == "Sharur"
                  ? res.__("sharur")
                  : oneJob.city == "Shusha"
                  ? res.__("shusha")
                  : oneJob.city == "Siyazan"
                  ? res.__("siyazan")
                  : oneJob.city == "Sumgait"
                  ? res.__("sumgait")
                  : oneJob.city == "Terter"
                  ? res.__("terter")
                  : oneJob.city == "Tovuz"
                  ? res.__("tovuz")
                  : oneJob.city == "Ujar"
                  ? res.__("ujar")
                  : oneJob.city == "Yardymly"
                  ? res.__("yardymly")
                  : oneJob.city == "Yevlakh"
                  ? res.__("yevlakh")
                  : oneJob.city == "Zaqatala"
                  ? res.__("zaqatala")
                  : oneJob.city == "Zangilan"
                  ? res.__("zangilan")
                  : oneJob.city == "Zardab"
                  ? res.__("zardab")
                  : oneJob.city == "Samukh"
                  ? res.__("samukh")
                  : oneJob.city == "Shahbuz"
                  ? res.__("shahbuz")
                  : oneJob.city == "Shirvan"
                  ? res.__("shirvan")
                  : oneJob.city == "Khankendi"
                  ? res.__("khankendi")
                  : oneJob.city == "Istanbul"
                  ? res.__("istanbul")
                  : oneJob.city == "Ankara"
                  ? res.__("ankara")
                  : oneJob.city == "Izmir"
                  ? res.__("izmir")
                  : oneJob.city == "Bursa"
                  ? res.__("bursa")
                  : oneJob.city == "Adana"
                  ? res.__("adana")
                  : oneJob.city == "Gaziantep"
                  ? res.__("gaziantep")
                  : oneJob.city == "Konya"
                  ? res.__("konya")
                  : oneJob.city == "Antalya"
                  ? res.__("antalya")
                  : oneJob.city == "Kayseri"
                  ? res.__("kayseri")
                  : oneJob.city == "Mersin"
                  ? res.__("mersin")
                  : oneJob.city == "Moscow"
                  ? res.__("moscow")
                  : oneJob.city == "Saint Petersburg"
                  ? res.__("st_petersburg")
                  : oneJob.city == "Novosibirsk"
                  ? res.__("novosibirsk")
                  : oneJob.city == "Yekaterinburg"
                  ? res.__("yekaterinburg")
                  : oneJob.city == "Nizhny Novgorod"
                  ? res.__("nizhny_novgorod")
                  : oneJob.city == "Kazan"
                  ? res.__("kazan")
                  : oneJob.city == "Chelyabinsk"
                  ? res.__("chelyabinsk")
                  : oneJob.city == "Samara"
                  ? res.__("samara")
                  : oneJob.city == "Omsk"
                  ? res.__("omsk")
                  : oneJob.city == "Rostov-on-Don"
                  ? res.__("rostov_on_don")
                  : oneJob.city == "Almaty"
                  ? res.__("almaty")
                  : oneJob.city == "Astana"
                  ? res.__("astana")
                  : oneJob.city == "Shymkent"
                  ? res.__("shymkent")
                  : oneJob.city == "Karaganda"
                  ? res.__("karaganda")
                  : oneJob.city == "Aktobe"
                  ? res.__("aktobe")
                  : oneJob.city == "Taldykorgan"
                  ? res.__("taldykorgan")
                  : oneJob.city == "Uralsk"
                  ? res.__("uralsk")
                  : oneJob.city == "Pavlodar"
                  ? res.__("pavlodar")
                  : oneJob.city == "Taraz"
                  ? res.__("taraz")
                  : oneJob.city == "Aktau"
                  ? res.__("aktau")
                  : null,
              trCategory:
                oneJob.category == "Information Technology (IT)"
                  ? res.__("information_technology")
                  : oneJob.category == "Finance"
                  ? res.__("finance")
                  : oneJob.category == "Healthcare"
                  ? res.__("healthcare")
                  : oneJob.category == "Engineering"
                  ? res.__("engineering")
                  : oneJob.category == "Sales"
                  ? res.__("sales")
                  : oneJob.category == "Marketing"
                  ? res.__("marketing")
                  : oneJob.category == "Education"
                  ? res.__("education_category")
                  : oneJob.category == "Customer Service"
                  ? res.__("customer_service")
                  : oneJob.category == "Human Resources"
                  ? res.__("human_resources")
                  : oneJob.category == "Digital Commerce"
                  ? res.__("digital_commerce")
                  : oneJob.category == "Service Industry"
                  ? res.__("service_industry")
                  : oneJob.category == "Law"
                  ? res.__("law")
                  : oneJob.category == "Construction"
                  ? res.__("construction")
                  : oneJob.category == "Industry"
                  ? res.__("industry")
                  : oneJob.category == "Transportation"
                  ? res.__("transportation")
                  : oneJob.category == "Arts & Entertainment"
                  ? res.__("arts_entertainment")
                  : oneJob.category == "Food Service"
                  ? res.__("food_service")
                  : oneJob.category == "Management"
                  ? res.__("management")
                  : oneJob.category == "Science"
                  ? res.__("science")
                  : oneJob.category == "Non-Profit Organizations"
                  ? res.__("non_profit_organizations")
                  : res.__("other"),
              trDate: changeDate(oneJob.createdAt, res.__("today")),
            };
          } catch (error) {
            console.error("Error fetching user details:", error);
            // Handle error if necessary, e.g., return the original job details
            return oneJob._doc;
          }
        })
      );
    } else {
      jobs = await Promise.all(
        allJobs.map(async (oneJob) => {
          try {
            return {
              ...oneJob._doc,
              savedJob: false,
              likedJob: false,
              reportedJob: false,
              myJob: false,
              appliedJobs: false,
              trCity:
                oneJob.city == "Absheron"
                  ? res.__("absheron")
                  : oneJob.city == "Aghjabadi"
                  ? res.__("aghjabadi")
                  : oneJob.city == "Aghdam"
                  ? res.__("aghdam")
                  : oneJob.city == "Aghdash"
                  ? res.__("aghdash")
                  : oneJob.city == "Aghstafa"
                  ? res.__("aghstafa")
                  : oneJob.city == "Aghsu"
                  ? res.__("aghsu")
                  : oneJob.city == "Astara"
                  ? res.__("astara")
                  : oneJob.city == "Babek"
                  ? res.__("babek")
                  : oneJob.city == "Baku"
                  ? res.__("baku")
                  : oneJob.city == "Balakan"
                  ? res.__("balakan")
                  : oneJob.city == "Barda"
                  ? res.__("barda")
                  : oneJob.city == "Beylagan"
                  ? res.__("beylagan")
                  : oneJob.city == "Bilasuvar"
                  ? res.__("bilasuvar")
                  : oneJob.city == "Jabrayil"
                  ? res.__("jabrayil")
                  : oneJob.city == "Jalilabad"
                  ? res.__("jalilabad")
                  : oneJob.city == "Julfar"
                  ? res.__("julfar")
                  : oneJob.city == "Dashkesan"
                  ? res.__("dashkesan")
                  : oneJob.city == "Gedabek"
                  ? res.__("gedabek")
                  : oneJob.city == "Ganja"
                  ? res.__("ganja")
                  : oneJob.city == "Goranboy"
                  ? res.__("goranboy")
                  : oneJob.city == "Goychay"
                  ? res.__("goychay")
                  : oneJob.city == "Goygol"
                  ? res.__("goygol")
                  : oneJob.city == "Khachmaz"
                  ? res.__("khachmaz")
                  : oneJob.city == "Imishli"
                  ? res.__("imishli")
                  : oneJob.city == "Ismayilli"
                  ? res.__("ismayilli")
                  : oneJob.city == "Kelbajar"
                  ? res.__("kelbajar")
                  : oneJob.city == "Lachin"
                  ? res.__("lachin")
                  : oneJob.city == "Lankaran"
                  ? res.__("lankaran")
                  : oneJob.city == "Lerik"
                  ? res.__("lerik")
                  : oneJob.city == "Masalli"
                  ? res.__("masalli")
                  : oneJob.city == "Mingachevir"
                  ? res.__("mingachevir")
                  : oneJob.city == "Naftalan"
                  ? res.__("naftalan")
                  : oneJob.city == "Nakhchivan"
                  ? res.__("nakhchivan")
                  : oneJob.city == "Neftchala"
                  ? res.__("neftchala")
                  : oneJob.city == "Oguz"
                  ? res.__("oguz")
                  : oneJob.city == "Ordubad"
                  ? res.__("ordubad")
                  : oneJob.city == "Kabala"
                  ? res.__("kabala")
                  : oneJob.city == "Kakh"
                  ? res.__("kakh")
                  : oneJob.city == "Gazakh"
                  ? res.__("gazakh")
                  : oneJob.city == "Gobustan"
                  ? res.__("gobustan")
                  : oneJob.city == "Kuba"
                  ? res.__("kuba")
                  : oneJob.city == "Kubadly"
                  ? res.__("kubadly")
                  : oneJob.city == "Qusar"
                  ? res.__("qusar")
                  : oneJob.city == "Saatly"
                  ? res.__("saatly")
                  : oneJob.city == "Sabirabad"
                  ? res.__("sabirabad")
                  : oneJob.city == "Salyan"
                  ? res.__("salyan")
                  : oneJob.city == "Shamakhi"
                  ? res.__("shamakhi")
                  : oneJob.city == "Sheki"
                  ? res.__("sheki")
                  : oneJob.city == "Shamkir"
                  ? res.__("shamkir")
                  : oneJob.city == "Sharur"
                  ? res.__("sharur")
                  : oneJob.city == "Shusha"
                  ? res.__("shusha")
                  : oneJob.city == "Siyazan"
                  ? res.__("siyazan")
                  : oneJob.city == "Sumgait"
                  ? res.__("sumgait")
                  : oneJob.city == "Terter"
                  ? res.__("terter")
                  : oneJob.city == "Tovuz"
                  ? res.__("tovuz")
                  : oneJob.city == "Ujar"
                  ? res.__("ujar")
                  : oneJob.city == "Yardymly"
                  ? res.__("yardymly")
                  : oneJob.city == "Yevlakh"
                  ? res.__("yevlakh")
                  : oneJob.city == "Zaqatala"
                  ? res.__("zaqatala")
                  : oneJob.city == "Zangilan"
                  ? res.__("zangilan")
                  : oneJob.city == "Zardab"
                  ? res.__("zardab")
                  : oneJob.city == "Samukh"
                  ? res.__("samukh")
                  : oneJob.city == "Shahbuz"
                  ? res.__("shahbuz")
                  : oneJob.city == "Shirvan"
                  ? res.__("shirvan")
                  : oneJob.city == "Khankendi"
                  ? res.__("khankendi")
                  : oneJob.city == "Istanbul"
                  ? res.__("istanbul")
                  : oneJob.city == "Ankara"
                  ? res.__("ankara")
                  : oneJob.city == "Izmir"
                  ? res.__("izmir")
                  : oneJob.city == "Bursa"
                  ? res.__("bursa")
                  : oneJob.city == "Adana"
                  ? res.__("adana")
                  : oneJob.city == "Gaziantep"
                  ? res.__("gaziantep")
                  : oneJob.city == "Konya"
                  ? res.__("konya")
                  : oneJob.city == "Antalya"
                  ? res.__("antalya")
                  : oneJob.city == "Kayseri"
                  ? res.__("kayseri")
                  : oneJob.city == "Mersin"
                  ? res.__("mersin")
                  : oneJob.city == "Moscow"
                  ? res.__("moscow")
                  : oneJob.city == "Saint Petersburg"
                  ? res.__("st_petersburg")
                  : oneJob.city == "Novosibirsk"
                  ? res.__("novosibirsk")
                  : oneJob.city == "Yekaterinburg"
                  ? res.__("yekaterinburg")
                  : oneJob.city == "Nizhny Novgorod"
                  ? res.__("nizhny_novgorod")
                  : oneJob.city == "Kazan"
                  ? res.__("kazan")
                  : oneJob.city == "Chelyabinsk"
                  ? res.__("chelyabinsk")
                  : oneJob.city == "Samara"
                  ? res.__("samara")
                  : oneJob.city == "Omsk"
                  ? res.__("omsk")
                  : oneJob.city == "Rostov-on-Don"
                  ? res.__("rostov_on_don")
                  : oneJob.city == "Almaty"
                  ? res.__("almaty")
                  : oneJob.city == "Astana"
                  ? res.__("astana")
                  : oneJob.city == "Shymkent"
                  ? res.__("shymkent")
                  : oneJob.city == "Karaganda"
                  ? res.__("karaganda")
                  : oneJob.city == "Aktobe"
                  ? res.__("aktobe")
                  : oneJob.city == "Taldykorgan"
                  ? res.__("taldykorgan")
                  : oneJob.city == "Uralsk"
                  ? res.__("uralsk")
                  : oneJob.city == "Pavlodar"
                  ? res.__("pavlodar")
                  : oneJob.city == "Taraz"
                  ? res.__("taraz")
                  : oneJob.city == "Aktau"
                  ? res.__("aktau")
                  : null,
              trCategory:
                oneJob.category == "Information Technology (IT)"
                  ? res.__("information_technology")
                  : oneJob.category == "Finance"
                  ? res.__("finance")
                  : oneJob.category == "Healthcare"
                  ? res.__("healthcare")
                  : oneJob.category == "Engineering"
                  ? res.__("engineering")
                  : oneJob.category == "Sales"
                  ? res.__("sales")
                  : oneJob.category == "Marketing"
                  ? res.__("marketing")
                  : oneJob.category == "Education"
                  ? res.__("education_category")
                  : oneJob.category == "Customer Service"
                  ? res.__("customer_service")
                  : oneJob.category == "Human Resources"
                  ? res.__("human_resources")
                  : oneJob.category == "Digital Commerce"
                  ? res.__("digital_commerce")
                  : oneJob.category == "Service Industry"
                  ? res.__("service_industry")
                  : oneJob.category == "Law"
                  ? res.__("law")
                  : oneJob.category == "Construction"
                  ? res.__("construction")
                  : oneJob.category == "Industry"
                  ? res.__("industry")
                  : oneJob.category == "Transportation"
                  ? res.__("transportation")
                  : oneJob.category == "Arts & Entertainment"
                  ? res.__("arts_entertainment")
                  : oneJob.category == "Food Service"
                  ? res.__("food_service")
                  : oneJob.category == "Management"
                  ? res.__("management")
                  : oneJob.category == "Science"
                  ? res.__("science")
                  : oneJob.category == "Non-Profit Organizations"
                  ? res.__("non_profit_organizations")
                  : res.__("other"),
              trDate: changeDate(oneJob.createdAt, res.__("today")),
            };
          } catch (error) {
            console.error("Error fetching user details:", error);
            // Handle error if necessary, e.g., return the original job details
            return oneJob._doc;
          }
        })
      );
    }
    // Fetch jobs with the applied filter

    res.status(200).json({
      error: false,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const createJob = async (req, res) => {
  try {
    const { email } = req.user;
    const {
      title,
      description,
      lauch,
      salary,
      type,
      location,
      city,
      companyEmail,
      companyName,
      createdBy,
      agreement,
      category,
      country,
      criterion,
      currency,
      longitude,
      latitude,
    } = req.body;

    // Check if any required fields are empty
    if (!category) {
      return res.status(419).json({
        error: {
          type: "category",
          message: res.__("job_category_is_required"),
        },
      });
    } else if (!title) {
      return res.status(419).json({
        error: {
          type: "title",
          message: res.__("title_field_is_required"),
        },
      });
    } else if (!type) {
      return res.status(419).json({
        error: {
          type: "type",
          message: res.__("type_field_is_required"),
        },
      });
    } else if (!companyName && req.query.type !== "Daily") {
      return res.status(419).json({
        error: {
          type: "companyName",
          message: res.__("company_name_is_required"),
        },
      });
    } else if (
      !validator.validate(companyEmail) &&
      req.query.type !== "Daily"
    ) {
      return res.status(419).json({
        error: {
          type: "companyEmail",
          message: res.__("company_email_is_required"),
        },
      });
    } else if (!city) {
      return res.status(419).json({
        error: {
          type: "city",
          message: res.__("city_field_is_required"),
        },
      });
    } else if (!location) {
      return res.status(419).json({
        error: {
          type: "location",
          message: res.__("address_field_is_required"),
        },
      });
    } else if (!longitude || !latitude) {
      return res.status(419).json({
        error: {
          type: "map",
          message: "Please enter latitude and longitude",
        },
      });
    } else if (!salary) {
      return res.status(419).json({
        error: {
          type: "salary",
          message: res.__("cost_field_is_required"),
        },
      });
    } else if (!criterion) {
      return res.status(419).json({
        error: {
          type: "criterion",
          message: res.__("criterion_field_is_required"),
        },
      });
    } else if (!currency) {
      return res.status(419).json({
        error: {
          type: "currency",
          message: res.__("currency_section_is_required"),
        },
      });
    } else if (!lauch) {
      return res.status(419).json({
        error: {
          type: "lauch",
          message: res.__("lunch_field_is_required"),
        },
      });
    } else if (description.length < 60) {
      return res.status(419).json({
        error: {
          type: "description",
          message: res.__("description_field_is_required"),
        },
      });
    } else if (!agreement) {
      return res.status(419).json({
        error: {
          type: "agreement",
          message: res.__("agreement_required"),
        },
      });
    }
    // Check if the 'createdBy' user exists with the email from req.user
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        error: true,
        message: "User not found with the provided email",
      });
    }

    // Create a new job, assuming 'createdBy' is the user with the matching email

    const newJob = new job({
      title,
      description,
      lauch,
      salary,
      type,
      location,
      city,
      agreement,
      category,
      criterion,
      currency,
      country,
      companyEmail: companyEmail,
      companyName: companyName,
      createdBy: existingUser._id,
      longitude,
      latitude,
      addedUser: existingUser._id, // Assign the user's ID as the 'createdBy' value
    });
    let endDate = new Date();
    const millisecondsInDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    const millisecondsInMonth = millisecondsInDay * 30; // Milliseconds in a month (approximate)

    if (newJob.type === "Daily") {
      // Add 3 days if the job type is "Daily"
      endDate.setTime(Date.now() + 10 * millisecondsInDay);
    } else {
      // Add one month if the job type is not "Daily"
      endDate.setTime(Date.now() + millisecondsInMonth);
    }

    // Save the new job to the database
    newJob.endDate = endDate;
    if (existingUser.balance >= 40) {
      existingUser.balance = existingUser.balance - 40;
      const savedJob = await newJob.save();
      // Schedule a job status update for 3 days in the future
      // Schedule the job status update

      // Add the job object to the 'addedJobs' array of the user
      existingUser.addedJobs.push(savedJob);

      // Save the updated user document
      await existingUser.save();

      const responseObject = {
        error: false,
        data: {
          job: newJob,
          user: {
            email: existingUser.email,
            // Add other user fields as needed
          },
        },
      };
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: "qafulovh@gmail.com",
        subject: "Yeni elan",
        html: `
            <html>
              <body>
              <img src="https://worklytest.s3.eu-north-1.amazonaws.com/image23.png" alt="Image description" style="width: 200px; height: auto;" />
                <h1 style="color: black; font-size: 28px;">Yeni elan elave edildi</h1>
              
                <p>Lutfen adminpaneli yoxlayin</p>
              </body>
            </html>
          `,
      };
      await transporter.sendMail(mailOptions);
      res.status(201).json({
        error: false,
        data: responseObject,
      });
    } else {
      return res.status(419).json({
        error: {
          type: "agreement",
          message: res.__("balance_not_valid"),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getAllMyJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }
    const jobIds = myUser.addedJobs; // Sadece iş kimliklerini alıyoruz
    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobs = await job
      .find({ _id: { $in: jobIds } })
      .sort({ createdAt: -1 });
    jobList = allJobs.map((oneJob) => ({
      ...oneJob._doc,
      company: myUser.name + " " + myUser.surname,
      email: myUser.email,
      image: myUser.image,
      savedJob: myUser.savedJobs.includes(oneJob._id),
      likedJob: myUser.likedJobs.includes(oneJob._id),
      reportedJob: myUser.reportedJobs.includes(oneJob._id),
      myJob: myUser.addedJobs.includes(oneJob._id),
      trDate: changeDate(oneJob.createdAt, res.__("today")),
    }));
    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMySavedJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const jobIds = myUser.savedJobs;
    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobsList = await job
      .find({ _id: { $in: jobIds } })
      .sort({ createdAt: -1 });
    const allJobs = allJobsList.filter((job) => job.status !== "deleted");
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
            trDate: changeDate(oneJob.createdAt, res.__("today")),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMyLikedJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const jobIds = myUser.likedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobs = await job.find({ _id: { $in: jobIds } });
    jobList = allJobs.map((oneJob) => ({
      ...oneJob._doc,
      savedJob: myUser.savedJobs.includes(oneJob._id),
      likedJob: myUser.likedJobs.includes(oneJob._id),
      reportedJob: myUser.reportedJobs.includes(oneJob._id),
      myJob: myUser.addedJobs.includes(oneJob._id),
      appliedJob: myUser.appliedJobs.includes(oneJob._id),
    }));
    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMyReportedJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const jobIds = myUser.reportedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    const allJobsList = await job.find({ _id: { $in: jobIds } });
    const allJobs = allJobsList.filter((job) => job.status !== "deleted");
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
            trDate: changeDate(oneJob.createdAt, res.__("today")),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getMyAppledJobs = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        error: true,
        message: "Kimlik doğrulama başarısız",
      });
    }

    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Kullanıcı bulunamadı",
      });
    }

    const jobIds = myUser.appliedJobs; // Sadece iş kimliklerini alıyoruz

    // İş kimliklerini kullanarak iş nesnelerini çekiyoruz
    var allJobs = await job.find({ _id: { $in: jobIds } });
    allJobs = allJobs.filter((job) => {
      return (
        job.status !== "deleted" &&
        job.status !== "pending" &&
        job.status !== "rejected"
      );
    });
    if (req.query.status === "active") {
      allJobs = await allJobs.filter((job) => job.status === "active");
    } else if (req.query.status === "closed") {
      allJobs = await allJobs.filter((job) => job.status === "closed");
    }
    jobList = await Promise.all(
      allJobs.map(async (oneJob) => {
        try {
          const newUser = await user.findOne(oneJob.createdBy);
          return {
            ...oneJob._doc,
            company: newUser.name + " " + newUser.surname,
            image: newUser.image,
            email: newUser.email,
            savedJob: myUser.savedJobs.includes(oneJob._id),
            likedJob: myUser.likedJobs.includes(oneJob._id),
            reportedJob: myUser.reportedJobs.includes(oneJob._id),
            myJob: myUser.addedJobs.includes(oneJob._id),
            appliedJobs: myUser.appliedJobs.includes(oneJob._id),
            trDate: changeDate(oneJob.createdAt, res.__("today")),
          };
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error if necessary, e.g., return the original job details
          return oneJob._doc;
        }
      })
    );
    res.status(200).json({
      error: false,
      data: jobList,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getOneMyJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    if (!email) {
      req.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });
      if (!myUser) {
        req.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        const myJob = await job.findOne({ _id: id });
        res.status(200).json({
          error: false,
          data: myJob,
        });
      }
    }
  } catch (error) {
    req.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const getOneJob = async (req, res) => {
  try {
    const { id, email, lang } = req.query;
    if (!id) {
      res.status(404).json({
        error: true,
        message: "Job not found",
      });
    } else {
      const newJob = await job
        .findOne({ _id: id })
        .populate("applicants", "name email surname image role")
        .populate("addedUser", "name surname email role image")
        .populate("interview", "name surname email image role");
      const userFromId = await user.findOne(newJob.createdBy);
      var addedJob = false;
      var savedJob = false;
      var likedJob = false;
      var reportedJob = false;
      var appliedJob = false;
      var timeToEnd = 0;
      const company = userFromId.name + " " + userFromId.surname;
      const userEmail = userFromId.email;
      const userImage = userFromId.image;
      // Initialize timeToEnd to 0

      if (email) {
        const myUser = await user.findOne({ email: email });
        addedJob = myUser.addedJobs.includes(newJob._id);
        savedJob = myUser.savedJobs.includes(newJob._id);
        likedJob = myUser.likedJobs.includes(newJob._id);
        reportedJob = myUser.reportedJobs.includes(newJob._id);
        appliedJob = myUser.appliedJobs.includes(newJob._id);
      }

      if (newJob) {
        if (newJob.endDate) {
          const now = new Date();
          const endDate = new Date(newJob.endDate);
          timeToEnd = Math.max(0, endDate - now);

          const formattedTimeToEnd = formatTimeRemaining(timeToEnd, res);

          const jobWithMyStatus = {
            ...newJob._doc,
            company: company,
            email: userEmail,
            image: userImage,
            addedJob: addedJob,
            savedJob: savedJob,
            likeJob: likedJob,
            reportedJob: reportedJob,
            appliedJob: appliedJob,
            timeToEnd: formattedTimeToEnd,
            trCategory:
              newJob.category == "Information Technology (IT)"
                ? res.__("information_technology")
                : newJob.category == "Finance"
                ? res.__("finance")
                : newJob.category == "Healthcare"
                ? res.__("healthcare")
                : newJob.category == "Engineering"
                ? res.__("engineering")
                : newJob.category == "Sales"
                ? res.__("sales")
                : newJob.category == "Marketing"
                ? res.__("marketing")
                : newJob.category == "Education"
                ? res.__("education_category")
                : newJob.category == "Customer Service"
                ? res.__("customer_service")
                : newJob.category == "Human Resources"
                ? res.__("human_resources")
                : newJob.category == "Digital Commerce"
                ? res.__("digital_commerce")
                : newJob.category == "Service Industry"
                ? res.__("service_industry")
                : newJob.category == "Law"
                ? res.__("law")
                : newJob.category == "Construction"
                ? res.__("construction")
                : newJob.category == "Industry"
                ? res.__("industry")
                : newJob.category == "Transportation"
                ? res.__("transportation")
                : newJob.category == "Arts & Entertainment"
                ? res.__("arts_entertainment")
                : newJob.category == "Food Service"
                ? res.__("food_service")
                : newJob.category == "Management"
                ? res.__("management")
                : newJob.category == "Science"
                ? res.__("science")
                : newJob.category == "Non-Profit Organizations"
                ? res.__("non_profit_organizations")
                : res.__("other"),
            trCity:
              newJob.city == "Absheron"
                ? res.__("absheron")
                : newJob.city == "Aghjabadi"
                ? res.__("aghjabadi")
                : newJob.city == "Aghdam"
                ? res.__("aghdam")
                : newJob.city == "Aghdash"
                ? res.__("aghdash")
                : newJob.city == "Aghstafa"
                ? res.__("aghstafa")
                : newJob.city == "Aghsu"
                ? res.__("aghsu")
                : newJob.city == "Astara"
                ? res.__("astara")
                : newJob.city == "Babek"
                ? res.__("babek")
                : newJob.city == "Baku"
                ? res.__("baku")
                : newJob.city == "Balakan"
                ? res.__("balakan")
                : newJob.city == "Barda"
                ? res.__("barda")
                : newJob.city == "Beylagan"
                ? res.__("beylagan")
                : newJob.city == "Bilasuvar"
                ? res.__("bilasuvar")
                : newJob.city == "Jabrayil"
                ? res.__("jabrayil")
                : newJob.city == "Jalilabad"
                ? res.__("jalilabad")
                : newJob.city == "Julfar"
                ? res.__("julfar")
                : newJob.city == "Dashkesan"
                ? res.__("dashkesan")
                : newJob.city == "Gedabek"
                ? res.__("gedabek")
                : newJob.city == "Ganja"
                ? res.__("ganja")
                : newJob.city == "Goranboy"
                ? res.__("goranboy")
                : newJob.city == "Goychay"
                ? res.__("goychay")
                : newJob.city == "Goygol"
                ? res.__("goygol")
                : newJob.city == "Khachmaz"
                ? res.__("khachmaz")
                : newJob.city == "Imishli"
                ? res.__("imishli")
                : newJob.city == "Ismayilli"
                ? res.__("ismayilli")
                : newJob.city == "Kelbajar"
                ? res.__("kelbajar")
                : newJob.city == "Lachin"
                ? res.__("lachin")
                : newJob.city == "Lankaran"
                ? res.__("lankaran")
                : newJob.city == "Lerik"
                ? res.__("lerik")
                : newJob.city == "Masalli"
                ? res.__("masalli")
                : newJob.city == "Mingachevir"
                ? res.__("mingachevir")
                : newJob.city == "Naftalan"
                ? res.__("naftalan")
                : newJob.city == "Nakhchivan"
                ? res.__("nakhchivan")
                : newJob.city == "Neftchala"
                ? res.__("neftchala")
                : newJob.city == "Oguz"
                ? res.__("oguz")
                : newJob.city == "Ordubad"
                ? res.__("ordubad")
                : newJob.city == "Kabala"
                ? res.__("kabala")
                : newJob.city == "Kakh"
                ? res.__("kakh")
                : newJob.city == "Gazakh"
                ? res.__("gazakh")
                : newJob.city == "Gobustan"
                ? res.__("gobustan")
                : newJob.city == "Kuba"
                ? res.__("kuba")
                : newJob.city == "Kubadly"
                ? res.__("kubadly")
                : newJob.city == "Qusar"
                ? res.__("qusar")
                : newJob.city == "Saatly"
                ? res.__("saatly")
                : newJob.city == "Sabirabad"
                ? res.__("sabirabad")
                : newJob.city == "Salyan"
                ? res.__("salyan")
                : newJob.city == "Shamakhi"
                ? res.__("shamakhi")
                : newJob.city == "Sheki"
                ? res.__("sheki")
                : newJob.city == "Shamkir"
                ? res.__("shamkir")
                : newJob.city == "Sharur"
                ? res.__("sharur")
                : newJob.city == "Shusha"
                ? res.__("shusha")
                : newJob.city == "Siyazan"
                ? res.__("siyazan")
                : newJob.city == "Sumgait"
                ? res.__("sumgait")
                : newJob.city == "Terter"
                ? res.__("terter")
                : newJob.city == "Tovuz"
                ? res.__("tovuz")
                : newJob.city == "Ujar"
                ? res.__("ujar")
                : newJob.city == "Yardymly"
                ? res.__("yardymly")
                : newJob.city == "Yevlakh"
                ? res.__("yevlakh")
                : newJob.city == "Zaqatala"
                ? res.__("zaqatala")
                : newJob.city == "Zangilan"
                ? res.__("zangilan")
                : newJob.city == "Zardab"
                ? res.__("zardab")
                : newJob.city == "Samukh"
                ? res.__("samukh")
                : newJob.city == "Shahbuz"
                ? res.__("shahbuz")
                : newJob.city == "Shirvan"
                ? res.__("shirvan")
                : newJob.city == "Khankendi"
                ? res.__("khankendi")
                : newJob.city == "Istanbul"
                ? res.__("istanbul")
                : newJob.city == "Ankara"
                ? res.__("ankara")
                : newJob.city == "Izmir"
                ? res.__("izmir")
                : newJob.city == "Bursa"
                ? res.__("bursa")
                : newJob.city == "Adana"
                ? res.__("adana")
                : newJob.city == "Gaziantep"
                ? res.__("gaziantep")
                : newJob.city == "Konya"
                ? res.__("konya")
                : newJob.city == "Antalya"
                ? res.__("antalya")
                : newJob.city == "Kayseri"
                ? res.__("kayseri")
                : newJob.city == "Mersin"
                ? res.__("mersin")
                : newJob.city == "Moscow"
                ? res.__("moscow")
                : newJob.city == "Saint Petersburg"
                ? res.__("st_petersburg")
                : newJob.city == "Novosibirsk"
                ? res.__("novosibirsk")
                : newJob.city == "Yekaterinburg"
                ? res.__("yekaterinburg")
                : newJob.city == "Nizhny Novgorod"
                ? res.__("nizhny_novgorod")
                : newJob.city == "Kazan"
                ? res.__("kazan")
                : newJob.city == "Chelyabinsk"
                ? res.__("chelyabinsk")
                : newJob.city == "Samara"
                ? res.__("samara")
                : newJob.city == "Omsk"
                ? res.__("omsk")
                : newJob.city == "Rostov-on-Don"
                ? res.__("rostov_on_don")
                : newJob.city == "Almaty"
                ? res.__("almaty")
                : newJob.city == "Astana"
                ? res.__("astana")
                : newJob.city == "Shymkent"
                ? res.__("shymkent")
                : newJob.city == "Karaganda"
                ? res.__("karaganda")
                : newJob.city == "Aktobe"
                ? res.__("aktobe")
                : newJob.city == "Taldykorgan"
                ? res.__("taldykorgan")
                : newJob.city == "Uralsk"
                ? res.__("uralsk")
                : newJob.city == "Pavlodar"
                ? res.__("pavlodar")
                : newJob.city == "Taraz"
                ? res.__("taraz")
                : newJob.city == "Aktau"
                ? res.__("aktau")
                : null,
            trDate: changeDate(newJob.createdAt, res.__("today")),
          };
          newJob.see = newJob.see + 1;
          await newJob.save();
          res.status(200).json({
            error: false,
            data: jobWithMyStatus,
          });
        } else {
          res.status(200).json({
            error: false,
            data: newJob,
          });
        }
      } else {
        res.status(404).json({
          error: true,
          message: "Job not found",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const updateJobStatus = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    const { status } = req.body;

    if (!status) {
      res.status(404).json({
        error: true,
        message: "Please select status",
      });
    } else if (!email) {
      res.status(404).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      const myUser = await user.findOne({ email: email });

      if (!myUser) {
        res.status(404).json({
          error: true,
          message: "Authentication failed",
        });
      } else {
        const currentJob = await job.findOne({ _id: id });

        if (!currentJob) {
          res.status(404).json({
            error: true,
            message: "Job not found",
          });
        } else {
          if (status === "active" && new Date() > currentJob.endDate) {
            res.status(419).json({
              error: false,
              message: res.__("end_date_has_already_passed"),
            });
          } else {
            await job.updateOne({ _id: id }, { status });
            const myJob = await job.findOne({ _id: id });
            if (status === "active") {
              myJob.interview = [];
              await myJob.save();
            }
            res.status(200).json({
              error: false,
              data: myJob,
              message: res.__("announce_status_updated"),
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const saveJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.savedJobs = myUser.savedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job unsaved successfully",
        });
      } else {
        myJob.rating = myJob.rating + 1;
        myUser.savedJobs.push(myJob);
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job saved successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const likeJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.likedJobs = myUser.likedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job dislaked successfully",
        });
      } else {
        myUser.likedJobs.push(myJob);
        myJob.rating = myJob.rating + 1;
        await myJob.save();
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job liked successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const reportJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { dislike } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (dislike) {
        myUser.reportedJobs = myUser.reportedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job unreported successfully",
        });
      } else {
        myUser.reportedJobs.push(myJob);
        await myUser.save();
        res.status(200).json({
          error: false,
          message: "Job reported successfully",
        });
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const applyFullStackJobs = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser.balance >= 10) {
      myUser.appliedJobs.push(myJob);
      myJob.rating = myJob.rating + 1;
      myUser.balance = myUser.balance - 10;
      await myUser.save();
      await myJob.save();
      res.status(200).json({
        error: false,
        message: "Apply successfully",
      });
    } else {
      return res.status(419).json({
        error: {
          type: "balance",
          message: res.__("balance_not_valid"),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const applyJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const { apply } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    const owner = await user.findOne({ _id: myJob.createdBy });
    const contain = myJob.applicants.filter(
      (one) => one._id.toString() == myUser._id.toString()
    );
    if (myUser && myJob) {
      if (apply) {
        myUser.appliedJobs = myUser.appliedJobs.filter(
          (likedJob) => likedJob._id.toString() !== myJob._id.toString()
        );
        myJob.applicants = myJob.applicants.filter(
          (one) => one._id.toString() !== myUser._id.toString()
        );
        myJob.rating = myJob.rating - 1;
        await myUser.save();
        await myJob.save();
        res.status(200).json({
          error: false,
          message: "Un apply successfully",
        });
      } else {
        if (myUser.role == "user") {
          return res.status(419).json({
            error: {
              type: "your_ad",
              message: res.__("change_account"),
            },
          });
        } else {
          if (myJob.status !== "active") {
            return res.status(419).json({
              error: {
                type: "your_ad",
                message: res.__("ad_exipired_or_closed"),
              },
            });
          } else {
            if (owner.blockUsers.includes(myUser._id)) {
              return res.status(419).json({
                error: {
                  type: "your_ad",
                  message: res.__("user_blocked_your_account"),
                },
              });
            } else {
              if (myUser.balance >= 10) {
                if (myUser._id.toString() == myJob.addedUser._id.toString()) {
                  return res.status(419).json({
                    error: {
                      type: "your_ad",
                      message: res.__("your_ad_error"),
                    },
                  });
                } else {
                  if (contain.length > 0) {
                    return res.status(419).json({
                      error: {
                        type: "your_ad",
                        message: res.__("you_already_applied"),
                      },
                    });
                  } else {
                    myUser.appliedJobs.push(myJob);
                    myJob.applicants.push(myUser);
                    sendPushNotification(
                      owner.fcmToken,
                      `${res.__("you_have_new_apply")} ✅`,
                      `${myUser.name} ${myUser.surname} ${res.__(
                        "sended_request"
                      )}`,
                      "apply",
                      myUser.email,
                      myUser.image,
                      myUser.email,
                      myUser.name + " " + myUser.surname
                    );
                    const notification = await createNotification(
                      "New apply",
                      `${myUser.name} ${myUser.surname}`,
                      myUser.image,
                      myJob._id,
                      "apply"
                    );
                    myJob.rating = myJob.rating + 1;
                    owner.notifications.push(notification);
                    myUser.balance = myUser.balance - 10;
                    myUser.apply_count = myUser.apply_count + 1;
                    owner.balance = owner.balance + 2;
                    await owner.save();
                    await myUser.save();
                    await myJob.save();
                    res.status(200).json({
                      error: false,
                      message: "Apply successfully",
                    });
                  }
                }
              } else {
                return res.status(419).json({
                  error: {
                    type: "balance",
                    message: res.__("balance_not_valid"),
                  },
                });
              }
            }
          }
        }
      }
    } else {
      return res.status(419).json({
        error: {
          type: "your_ad",
          message: "Job not found",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });

    if (!myUser && !myJob && !id && !email) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      myUser.addedJobs = myUser.addedJobs.filter(
        (likedJob) => likedJob._id.toString() !== myJob._id.toString()
      );
      myJob.status = "deleted";
      await myJob.save();
      await myUser.save();
      res.status(200).json({
        error: false,
        message: "Job deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const editJob = async (req, res) => {
  try {
    const { jobType } = req.query;
    const {
      category,
      title,
      type,
      currency,
      companyName,
      companyEmail,
      city,
      address,
      latitude,
      longitude,
      salary,
      criterion,
      lauch,
      description,
      images,
      id,
    } = req.body;
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (!email) {
      res.status(403).json({
        error: true,
        message: "Authentication failed",
      });
    } else {
      if (!category) {
        return res.status(419).json({
          error: {
            type: "category",
            message: res.__("job_category_is_required"),
          },
        });
      } else if (!title) {
        return res.status(419).json({
          error: {
            type: "title",
            message: res.__("title_field_is_required"),
          },
        });
      } else if (!type) {
        return res.status(419).json({
          error: {
            type: "type",
            message: res.__("type_field_is_required"),
          },
        });
      } else if (!companyName && jobType !== "Daily") {
        return res.status(419).json({
          error: {
            type: "companyName",
            message: res.__("company_name_is_required"),
          },
        });
      } else if (!companyEmail && jobType !== "Daily") {
        return res.status(419).json({
          error: {
            type: "companyEmail",
            message: res.__("company_email_is_required"),
          },
        });
      } else if (!city) {
        return res.status(419).json({
          error: {
            type: "city",
            message: res.__("city_field_is_required"),
          },
        });
      } else if (!address) {
        return res.status(419).json({
          error: {
            type: "address",
            message: res.__("address_field_is_required"),
          },
        });
      } else if (!longitude || !latitude) {
        return res.status(419).json({
          error: {
            type: "location",
            message: res.__("your_device_location_not_active"),
          },
        });
      } else if (!salary) {
        return res.status(419).json({
          error: {
            type: "salary",
            message: res.__("cost_field_is_required"),
          },
        });
      } else if (!currency) {
        return res.status(419).json({
          error: {
            type: "currency",
            message: res.__("currency_section_is_required"),
          },
        });
      } else if (!criterion) {
        return res.status(419).json({
          error: {
            type: "criterion",
            message: res.__("criterion_field_is_required"),
          },
        });
      } else if (!lauch) {
        return res.status(419).json({
          error: {
            type: "lauch",
            message: res.__("lunch_field_is_required"),
          },
        });
      } else if (!description) {
        return res.status(419).json({
          error: {
            type: "description",
            message: res.__("description_field_is_required"),
          },
        });
      } else if (myJob.endDate < Date.now()) {
        return res.status(419).json({
          error: {
            type: "balance",
            message: res.__("end_date_has_already_passed"),
          },
        });
      } else if (myUser.balance < 20) {
        return res.status(419).json({
          error: {
            type: "balance",
            message: res.__("balance_not_valid"),
          },
        });
      } else {
        await job.updateOne(
          { _id: id },
          {
            category: category,
            title: title,
            type: type,
            companyName: companyName,
            companyEmail: companyEmail,
            city: city,
            location: address,
            longitude: longitude,
            latitude: latitude,
            salary: salary,
            currency: currency,
            criterion: criterion,
            lauch: lauch,
            images: images,
            description: description,
            status: "pending",
          }
        );
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: "qafulovh@gmail.com",
          subject: "Yeni elan",
          html: `
              <html>
                <body>
                <img src="https://worklytest.s3.eu-north-1.amazonaws.com/image23.png" alt="Image description" style="width: 200px; height: auto;" />
                  <h1 style="color: black; font-size: 28px;">Yeni elan elave edildi</h1>
                
                  <p>Bir elan yenilendi</p>
                </body>
              </html>
            `,
        };
        await transporter.sendMail(mailOptions);
        myUser.balance = myUser.balance - 20;
        await myUser.save();
        const myJob = await job.findOne({ _id: id });
        res.status(201).json({
          error: false,
          data: myJob,
          message: res.__("announce_updated_successfully"),
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const jobUpdateSchedule = schedule.scheduleJob("*/5 * * * *", async () => {
  console.log("Running job update...");
  await updateJobStatusSchedule();
});

async function updateJobStatusSchedule() {
  try {
    const currentDate = new Date();

    // End date'i geçmiş ve deleted statusu olmayan işleri bul ve güncelle
    const result = await job.updateMany(
      {
        endDate: { $lt: currentDate },
        status: {
          $ne: "closed",
          $ne: "deleted",
          $ne: "pending",
          $ne: "rejected",
        },
      }, // End date'i geçmiş, statusu "closed" olmayan ve deleted statusu olmayan işleri bul
      { $set: { status: "closed" } } // Status'u "closed" olarak güncelle
    );

    console.log(`${result.modifiedCount} jobs updated.`);
  } catch (error) {
    console.error("Error updating job status:", error);
  } finally {
    // Veritabanı bağlantısını kapat
    console.log("Disconnected from MongoDB");
  }
}

function formatTimeRemaining(milliseconds, res) {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  const timeParts = [];

  if (days > 0) {
    timeParts.push(`${days} ${days > 1 ? res.__("days") : res.__("day")}`);
  }
  if (remainingHours > 0) {
    timeParts.push(
      `${remainingHours} ${
        remainingHours > 1 ? res.__("hours") : res.__("hour")
      }`
    );
  }
  if (remainingMinutes > 0) {
    timeParts.push(
      `${remainingMinutes} ${
        remainingMinutes > 1 ? res.__("minutes") : res.__("minute")
      }`
    );
  }

  // Eğer kalan süre bir saatden azsa "less than one hour" yaz
  if (days === 0 && hours === 0 && minutes < 60) {
    return res.__("less_than_one_hour");
  }

  return timeParts.join(" ");
}

const changeDate = (backendTime, newDate) => {
  // Get today's date
  const today = new Date();
  const backendDate = new Date(backendTime);
  // Check if the parsed date is today
  if (
    backendDate.getDate() === today.getDate() &&
    backendDate.getMonth() === today.getMonth() &&
    backendDate.getFullYear() === today.getFullYear()
  ) {
    // Format the time as "hh:mm"
    const formattedTime =
      backendDate.getHours().toString().padStart(2, "0") +
      ":" +
      backendDate.getMinutes().toString().padStart(2, "0");

    // Create the user-friendly time format
    const userFriendlyTime = `${newDate} ${formattedTime}`;

    // userFriendlyTime now contains the desired format, e.g., "today 09:26"
    return userFriendlyTime;
  } else {
    // If the date is not today, you can handle it accordingly, e.g., display the full date.
    const userFriendlyDate = backendDate.toLocaleDateString();
    return userFriendlyDate;
  }
};
const sendPushNotification = (
  to,
  title,
  body,
  type,
  id,
  image,
  email,
  name
) => {
  var message = {
    to: to,

    notification: {
      title: title,
      body: body,
    },
    data: {
      type: type,
      id: id,
      image: image,
      email: email,
      name: name,
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
const uploadImages = async (req, res) => {
  const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const { email } = req.user;
    const { jobId } = req.body;
    const thisJob = await job.findOne({ _id: jobId });
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      // Convert the base64 image data to a Buffer
      const base64ImageData = req.files.data.data;
      // Set the S3 bucket and object key
      const params = {
        Bucket: "worklytest",
        Key: req.files.data.name, // Change the filename as needed
        Body: base64ImageData,
      };

      // Upload the image to S3
      const command = new PutObjectCommand(params);
      await s3Client.send(command, async (err, data) => {
        if (err) {
          res.status(500).json({
            error: true,
            message: err.message,
          });
        } else {
          thisJob.images.push(
            `https://worklytest.s3.eu-north-1.amazonaws.com/${req.files.data.name}`
          );
          await thisJob.save();
          res.status(201).json({
            error: false,
            message: "Your image added successfully",
            data: data,
            location: `https://worklytest.s3.eu-north-1.amazonaws.com/${req.files.data.name}`,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Error uploading image to S3" });
  }
};
const raiseJob = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.body;
    const myUser = await user.findOne({ email: email });
    const myJob = await job.findOne({ _id: id });
    if (myUser && myJob) {
      if (myJob.endDate < Date.now()) {
        return res.status(419).json({
          error: {
            type: "date",
            message: res.__("end_date_has_already_passed"),
          },
        });
      } else {
        if (myUser.balance >= 20) {
          myJob.rating = myJob.rating + 10;
          myUser.balance = myUser.balance - 20;
          await myJob.save();
          await myUser.save();
          res.status(200).json({
            error: false,
            message: res.__("job_raised_successfully"),
          });
        } else {
          return res.status(419).json({
            error: {
              type: "balance",
              message: res.__("balance_not_valid"),
            },
          });
        }
      }
    } else {
      res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const addInterview = async (req, res) => {
  try {
    const { email } = req.user;
    const { userId, jobId, addToInterview } = req.body;

    // İşveren kullanıcıyı bul
    const myUser = await user.findOne({ email: email });
    if (!myUser) {
      return res.status(404).json({
        error: true,
        message: "Employer not found",
      });
    }

    // Aday kullanıcıyı bul
    const otherUser = await user.findOne({ _id: userId });
    if (!otherUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // İlgili işi bul
    const myJob = await job.findOne({ _id: jobId });
    if (!myJob) {
      return res.status(404).json({
        error: true,
        message: "Job not found",
      });
    }
    if (myJob.status == "active") {
      return res.status(419).json({
        error: true,
        message: res.__("can_add_interviewlist_on_after_close"),
      });
    }
    // Kullanıcının zaten interview listesinde olup olmadığını kontrol et
    const isAlreadyAdded = myJob.interview.some(
      (interviewUserId) => interviewUserId.toString() === userId
    );

    if (addToInterview) {
      // Kullanıcı zaten eklendiyse hata döndür
      if (isAlreadyAdded) {
        return res.status(419).json({
          error: true,
          message: res.__("user_already_added"),
        });
      }

      // Kullanıcıyı interview listesine ekle
      myJob.interview.push(otherUser._id);
      await myJob.save();

      res.status(200).json({
        error: false,
        message: res.__("user_added_successfully"),
      });
    } else {
      // Kullanıcıyı interview listesinden çıkar
      if (!isAlreadyAdded) {
        return res.status(419).json({
          error: true,
          message: res.__("user_already_added"),
        });
      }

      myJob.interview = myJob.interview.filter(
        (interviewUserId) => interviewUserId.toString() !== userId
      );
      await myJob.save();

      res.status(200).json({
        error: false,
        message: res.__("user_removed_successfully"),
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  createJob,
  getAllMyJobs,
  getOneJob,
  getOneMyJob,
  updateJobStatus,
  saveJob,
  likeJob,
  reportJob,
  getMySavedJobs,
  getMyLikedJobs,
  getMyReportedJobs,
  applyJob,
  getMyAppledJobs,
  deleteJob,
  editJob,
  sendPushNotification,
  uploadImages,
  getAllJobsAdmin,
  checkJob,
  reActiveJob,
  raiseJob,
  applyFullStackJobs,
  addInterview,
};
