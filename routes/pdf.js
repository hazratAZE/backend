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
    age,
    address,
    phone,
    myEmail,
    drive,
    military,
    linkedin,
    website,
    behance,
    github,
    eduLevel,
    eduInfo,
    workExperience,
    workInfo,
    skills,
    language,
    awards,
    about,
    image,
    color,
  } = req.body;

  // PDF belgesini oluştururken hata olup olmadığını kontrol et
  const { email } = req.user;
  const myUser = await user.findOne({ email: email });
  if (myUser.balance >= 100) {
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
          const doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
            size: "A4",
            info: {
              Title: "Resume",
              Author: `${name} ${surname}`,
            },
          });
          doc.font("./assets/fonts/arial-unicode-ms.ttf");
          // Diğer içerikler...

          // Resmi PDF'ye ekleyin
          doc.fillAndStroke(color).lineWidth(20);

          doc
            .fontSize(22)
            .fillColor("#000")
            .text(`${name} ${surname}`, { align: "center" });
          doc
            .fontSize(14)
            .fillColor("#666")
            .text(position, { align: "center" });
          doc.lineWidth(68);
          doc.fillAndStroke(color);
          doc.strokeOpacity(0.2);
          doc
            .moveTo(50, 70) // Başlangıç noktası
            .lineTo(doc.page.width - 50, 70) // Bitiş noktası
            .stroke();
          doc.image(imageData, doc.page.width - 150, 70, {
            fit: [90, 90], // Resmin boyutu
            align: "center", // Ortalama
            valign: "top", // En üstte
          });
          doc.moveDown(1);
          // Kişisel Bilgiler
          doc
            .fontSize(16)
            .fillColor(color)
            .text(res.__("personal_information"), { wordSpacing: 2 });

          doc.moveDown(0.2);
          doc.fontSize(8).fillColor("gray").text(res.__("age"));
          doc.fontSize(10).fillColor("#000").text(age);
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
          if (linkedin) {
            doc
              .moveDown(0.1)
              .fontSize(8)
              .fillColor("gray")
              .text(`LinkedIn: `)
              .fontSize(10)
              .fillColor("#000")
              .text(linkedin, { link: linkedin, underline: true });
          }

          if (website) {
            doc
              .moveDown(0.1)
              .fontSize(8)
              .fillColor("gray")
              .text(`Website: `)
              .fontSize(10)
              .fillColor("#000")
              .text(website, { link: website, underline: true });
          }

          if (github) {
            doc
              .moveDown(0.1)
              .fontSize(8)
              .fillColor("gray")
              .text(`GitHub: `)
              .fontSize(10)
              .fillColor("#000")
              .text(github, { link: github, underline: true });
          }

          if (behance) {
            doc
              .moveDown(0.1)
              .fontSize(8)
              .fillColor("gray")
              .text(`Behance: `)
              .fontSize(10)
              .fillColor("#000")
              .text(behance, { link: behance, underline: true });
          }
          doc.moveDown(0.5);
          doc.fontSize(16).fillColor(color).text(res.__("summary"));
          doc.moveDown(0.2);
          doc.fillColor("#000").fontSize(10).text(about);
          doc.moveDown(0.5);
          // Eğitim Bilgileri
          doc.fontSize(16).fillColor(color).text(res.__("education"));
          doc.moveDown(0.2);
          doc.fontSize(8).fillColor("gray").text(res.__("education_level"));
          doc.fontSize(10).fillColor("#000").text(eduLevel);
          doc.moveDown(0.1);
          doc.fontSize(8).fillColor("gray").text(res.__("education_info"));
          doc.fontSize(10).fillColor("#000").text(eduInfo);
          doc.moveDown(0.1);
          doc.moveDown(0.5);

          // İş Deneyimleri

          doc.fontSize(16).fillColor(color).text(res.__("work_experience"));
          doc.moveDown(0.2);
          doc.fontSize(8).fillColor("gray").text(res.__("experience_year"));
          doc.fontSize(10).fillColor("#000").text(workExperience);
          doc.moveDown(0.1);
          doc
            .fontSize(8)
            .fillColor("gray")
            .text(res.__("about_work_experience"));
          doc.fontSize(10).fillColor("#000").text(workInfo);
          doc.moveDown(0.1);
          doc.moveDown(0.5);

          // Beceriler
          doc.fontSize(16).fillColor(color).text(res.__("skills"));
          doc.moveDown(0.2);
          doc.fillColor("#000").fontSize(10).text(skills);
          doc.moveDown(0.5);

          // Diller
          doc.fontSize(16).fillColor(color).text(res.__("languages"));
          doc.moveDown(0.2);
          doc.fillColor("#000").fontSize(10).text(language);
          doc.moveDown(0.5);

          // Ödüller
          doc
            .fontSize(16)
            .fillColor(color)
            .text(`${res.__("awards")},${res.__("certificates")}`);
          doc.moveDown(0.2);
          doc.fillColor("#000").fontSize(10).text(awards);
          doc.moveDown(0.5);
          doc.fontSize(16).fillColor(color).text(res.__("driver_license"));
          doc.moveDown(0.2);
          doc
            .fontSize(10)
            .fillColor("#000")
            .text(drive == "yes" ? res.__("yes") : res.__("no"));
          doc.moveDown(0.5);
          doc.fontSize(16).fillColor(color).text(res.__("military"));
          doc.moveDown(0.2);
          doc
            .fontSize(10)
            .fillColor("#000")
            .text(military == "yes" ? res.__("yes") : res.__("no"));
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
        myUser.balance = myUser.balance - 100;
        await myUser.save();
      })
      .on("error", (error) => {
        console.error("Resim indirme hatası:", error);
        // Hata durumunda uygun bir yanıt gönderin
        res.status(500).send("Resim indirilemedi.");
      });
  } else {
    return res.status(419).json({
      error: {
        type: "agreement",
        message: res.__("balance_not_valid"),
      },
    });
  }
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
