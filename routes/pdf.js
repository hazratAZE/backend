const express = require("express");
const routes = express.Router();
const PDFDocument = require("pdfkit");
const https = require("https");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { verifyJwt } = require("../middleware/jwt");
const user = require("../schemas/user");

routes.post("/generate-pdf", verifyJwt, async (req, res) => {
  // PDF oluşturmak için yeni bir PDF belgesi oluştur
  const {
    name,
    surname,
    position,
    date_of_birth,
    address,
    phone,
    myEmail,
    drive,
    military,
    linkedin,
    website,
    eduList,
    workList,
    skillList,
    langList,
    awardList,
    ceritificates,
    about,
    image,
  } = req.body;

  // PDF belgesini oluştururken hata olup olmadığını kontrol et
  const { email } = req.user;
  const myUser = await user.findOne({ email: email });
  console.log(eduList);
  https
    .get(image, async (response) => {
      // Resmi tutacak bir dizi oluşturun
      const chunks = [];

      // Resim verisi geldiğinde
      response.on("data", (chunk) => {
        // Her parçayı diziye ekleyin
        chunks.push(chunk);
      });

      // Tüm resim verisi geldiğinde
      response.on("end", () => {
        // Resmi PDF'ye ekleyin
        const imageData = Buffer.concat(chunks);

        // Diziyi birleştirerek tam resim verisini elde edin
        // PDF belgesi oluşturun
        const doc = new PDFDocument();
        doc.font("./assets/fonts/arial-unicode-ms.ttf");
        // Diğer içerikler...

        // Resmi PDF'ye ekleyin
        doc.fillAndStroke("#0e8cc3").lineWidth(20);
        doc.image(imageData, doc.page.width - 170, 160, {
          fit: [90, 90], // Resmin boyutu
          align: "center", // Ortalama
          valign: "top", // En üstte
        });
        doc
          .fontSize(22)
          .fillColor("#000")
          .text(`${name} ${surname}`, { align: "center" });
        doc.fontSize(14).fillColor("#666").text(position, { align: "center" });
        doc.lineWidth(68);
        doc.fillAndStroke("#75bfec");
        doc.strokeOpacity(0.2);
        doc
          .moveTo(70, 96) // Başlangıç noktası
          .lineTo(doc.page.width - 70, 96) // Bitiş noktası
          .stroke();
        doc.moveDown(1);
        // Kişisel Bilgiler
        doc
          .fontSize(16)
          .fillColor("#75bfec")
          .text(res.__("personal_information"), { wordSpacing: 2 });

        doc.moveDown(0.2);
        doc.fontSize(8).fillColor("gray").text(res.__("date_of_birth"));
        doc.fontSize(10).fillColor("#000").text(date_of_birth);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(res.__("address"));
        doc.fontSize(10).fillColor("#000").text(address);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(res.__("telephone"));
        doc.fontSize(10).fillColor("#000").text(phone);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(res.__("email"));
        doc.fontSize(10).fillColor("#000").text(myEmail.toLowerCase());
        doc.moveDown(0.1);
        if (linkedin.length > 0) {
          doc.fontSize(8).fillColor("gray").text(`LinkedIn`);
          doc.fontSize(10).fillColor("#000").text(linkedin);
          doc.moveDown(0.1);
        }
        if (website.length > 0) {
          doc.fontSize(8).fillColor("gray").text(`Website`);
          doc.fontSize(10).fillColor("#000").text(website.toLowerCase());
          doc.moveDown(0.1);
        }
        doc.fontSize(8).fillColor("gray").text(res.__("driver_license"));
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(drive == "yes" ? res.__("yes") : res.__("no"));
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(res.__("military"));
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(military == "yes" ? res.__("yes") : res.__("no"));
        doc.moveDown(0.5);
        doc.fontSize(16).fillColor("#75bfec").text(res.__("summary"));
        doc.moveDown(0.2);
        doc.fillColor("#000").fontSize(10).text(about);
        doc.moveDown(0.5);
        // Eğitim Bilgileri
        doc.fontSize(16).fillColor("#75bfec").text(res.__("education"));
        doc.moveDown(0.2);
        eduList.forEach((edu) => {
          doc.fontSize(8).fillColor("gray").text(res.__("place_of_study"));
          doc.fontSize(10).fillColor("#000").text(edu.name);
          doc.fontSize(8).fillColor("gray").text(res.__("specialty"));
          doc.fontSize(10).fillColor("#000").text(edu.specialty);
          doc.fontSize(8).fillColor("gray").text(res.__("years_of_education"));
          doc.fontSize(10).fillColor("#000").text(`${edu.date}`);
          doc.moveDown(0.2);
        });

        doc.moveDown(0.5);

        // // İş Deneyimleri

        doc.fontSize(16).fillColor("#75bfec").text(res.__("work_experience"));
        doc.moveDown(0.2);
        workList.forEach((work) => {
          doc.fontSize(8).fillColor("gray").text(res.__("company"));
          doc.fontSize(10).fillColor("#000").text(work.company);
          doc.fontSize(8).fillColor("gray").text(res.__("position"));
          doc.fontSize(10).fillColor("#000").text(work.companyName);
          doc.fontSize(8).fillColor("gray").text(res.__("years_of_work"));
          doc.fontSize(10).fillColor("#000").text(`${work.date}`);
          doc.fontSize(8).fillColor("gray").text(res.__("about_work"));
          doc.fontSize(10).fillColor("#000").text(work.aboutJob);
          doc.moveDown(0.2);
        });

        doc.moveDown(0.5);

        // Beceriler
        doc.fontSize(16).fillColor("#75bfec").text(res.__("skills"));
        doc.moveDown(0.2);
        let newSkillList = "";

        // Becerileri birleştirin
        for (let index = 0; index < skillList.length; index++) {
          // Her beceriyi birleştirme stringine ekleyin
          newSkillList += skillList[index];

          // Her becerinin sonunda bir boşluk bırakın
          if (index !== skillList.length - 1) {
            newSkillList += "  |  ";
          }
        }

        // Becerileri yazdırın
        doc.fillColor("#000").fontSize(12).text(newSkillList);
        doc.moveDown(0.5);

        // Diller
        doc.fontSize(16).fillColor("#75bfec").text(res.__("languages"));
        doc.moveDown(0.2);
        langList.forEach((lang) => {
          doc
            .fillColor("#000")
            .fontSize(10)
            .text(
              `${lang.name}  -  ${
                lang.level == "1"
                  ? res.__("beginner")
                  : lang.level == "2"
                  ? res.__("intermediate")
                  : lang.level == "3"
                  ? res.__("advanced")
                  : res.__("superior")
              }`
            );
          doc.moveDown(0.2);
        });
        doc.moveDown(0.5);

        // Ödüller
        if (awardList.length > 0) {
          doc.fontSize(16).fillColor("#75bfec").text(res.__("awards"));
          doc.moveDown(0.2);
          awardList.forEach((award) => {
            doc
              .fillColor("#000")
              .fontSize(10)
              .text(`${award.name} - ${award.date}`);
          });
          doc.moveDown(0.5);
        }

        // Sertifikalar
        if (ceritificates.length > 0) {
          doc.fontSize(16).fillColor("#75bfec").text(res.__("certificates"));
          doc.moveDown(0.2);
          ceritificates.forEach((cert) => {
            doc
              .fillColor("#000")
              .fontSize(10)
              .text(`${cert.name} - ${cert.date}`);
          });
          doc.moveDown(0.5);
        }

        // Ek Bilgi

        // PDF belgesini oluşturmak için akışı bitirin

        // PDF belgesini oluşturmak için akışı bitirin
        doc.end();

        // HTTP yanıtı olarak PDF belgesini gönderin
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="generated.pdf"'
        );
        doc.pipe(res);
      });
      myUser.balance = myUser.balance - 200;
      await myUser.save();
    })
    .on("error", (error) => {
      console.error("Resim indirme hatası:", error);
      // Hata durumunda uygun bir yanıt gönderin
      res.status(500).send("Resim indirilemedi.");
    });

  // İçeriği ekleyin

  // PDF belgesini oluşturmak için akışı bitirin
});
routes.post("/add_image", verifyJwt, async (req, res) => {
  const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  try {
    const { email } = req.user;
    const myUser = await user.findOne({ email: email });
    if (myUser.balance < 200) {
      return res.status(419).json({
        error: {
          type: "balance",
          message: res.__("balance_not_valid"),
        },
      });
    }
    // Convert the base64 image data to a Buffer
    const base64ImageData = req.files.data.data;
    console.log(req.files.data);
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
        res.status(201).json({
          error: false,
          message: "Your image added successfully",
          data: data,
          location: `https://worklytest.s3.eu-north-1.amazonaws.com/${req.files.data.name}`,
        });
      }
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Error uploading image to S3" });
  }
});

module.exports = routes;
