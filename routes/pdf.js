const express = require("express");
const routes = express.Router();
const PDFDocument = require("pdfkit");
const https = require("https");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

routes.post("/generate-pdf", async (req, res) => {
  // PDF oluşturmak için yeni bir PDF belgesi oluştur
  const {
    name,
    surname,
    position,
    date_of_birth,
    address,
    phone,
    email,
    drive,
    linkedin,
    website,
    firstEdu,
    secondEdu,
    thirdEdu,
    firstWork,
    secondWork,
    thirdWork,
    skillList,
    langList,
    awardList,
    ceritificates,
    about,
    image,
  } = req.body;

  // PDF belgesini oluştururken hata olup olmadığını kontrol et

  https
    .get(image, (response) => {
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
        const imageData = Buffer.concat(chunks); // Diziyi birleştirerek tam resim verisini elde edin

        // PDF belgesi oluşturun
        const doc = new PDFDocument();
        doc.font("./assets/fonts/arial-unicode-ms.ttf");
        // Diğer içerikler...

        // Resmi PDF'ye ekleyin
        doc.image(imageData, 250, 20, {
          fit: [100, 100], // Resmin boyutu
          align: "center", // Ortalama
          valign: "top", // En üstte
        });
        doc.moveDown(4);
        // Başlık
        doc
          .fontSize(24)
          .fillColor("#333")
          .text(`${name} ${surname}`, { align: "center" });
        doc.fontSize(18).fillColor("#666").text(position, { align: "center" });
        doc.moveDown();

        // Kişisel Bilgiler
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Kişisel Bilgiler:", { underline: true });
        doc
          .fontSize(12)
          .fillColor("#666")
          .text(`Doğum Tarihi: ${date_of_birth}`);
        doc.fontSize(12).text(`Adres: ${address}`);
        doc.fontSize(12).text(`Telefon: ${phone}`);
        doc.fontSize(12).text(`E-posta: ${email}`);
        doc.moveDown();

        // Bağlantılar
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Bağlantılar:", { underline: true });
        doc.fontSize(12).fillColor("#666").text(`Google Drive: ${drive}`);
        doc.fontSize(12).text(`LinkedIn: ${linkedin}`);
        doc.fontSize(12).text(`Website: ${website}`);
        doc.moveDown();

        // Eğitim Bilgileri
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Eğitim Bilgileri:", { underline: true });
        doc
          .fontSize(12)
          .fillColor("#666")
          .text(`Eğitim Yeri: ${firstEdu.name}`);
        doc
          .fontSize(12)
          .text(`Eğitim Yılları: ${firstEdu.startDate} - ${firstEdu.endDate}`);
        doc.moveDown();
        if (secondEdu.name) {
          doc
            .fontSize(12)
            .fillColor("#666")
            .text(`Eğitim Yeri: ${secondEdu.name}`);
          doc
            .fontSize(12)
            .text(
              `Eğitim Yılları: ${secondEdu.startDate} - ${secondEdu.endDate}`
            );
          doc.moveDown();
        }

        // İş Deneyimleri
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("İş Deneyimleri:", { underline: true });
        doc
          .fontSize(12)
          .fillColor("#666")
          .text(`İş Yeri: ${firstWork.company}`);
        doc
          .fontSize(12)
          .text(`İş Yılları: ${firstWork.startDate} - ${firstWork.endDate}`);
        doc.moveDown();
        if (secondWork.company) {
          doc
            .fontSize(12)
            .fillColor("#666")
            .text(`İş Yeri: ${secondWork.company}`);
          doc
            .fontSize(12)
            .text(
              `İş Yılları: ${secondWork.startDate} - ${secondWork.endDate}`
            );
          doc.moveDown();
        }

        // Beceriler
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Beceriler:", { underline: true });
        skillList.forEach((skill) => {
          doc.fillColor("#666").text(skill);
        });
        doc.moveDown();

        // Diller
        doc.fontSize(14).fillColor("#333").text("Diller:", { underline: true });
        langList.forEach((lang) => {
          doc.fillColor("#666").text(`${lang.name} - ${lang.level}`);
        });
        doc.moveDown();

        // Ödüller
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Ödüller:", { underline: true });
        awardList.forEach((award) => {
          doc.fillColor("#666").text(`${award.name} - ${award.date}`);
        });
        doc.moveDown();

        // Sertifikalar
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Sertifikalar:", { underline: true });
        ceritificates.forEach((cert) => {
          doc.fillColor("#666").text(`${cert.name} - ${cert.date}`);
        });
        doc.moveDown();

        // Ek Bilgi
        doc
          .fontSize(14)
          .fillColor("#333")
          .text("Ek Bilgi:", { underline: true });
        doc.fillColor("#666").text(about);

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
    })
    .on("error", (error) => {
      console.error("Resim indirme hatası:", error);
      // Hata durumunda uygun bir yanıt gönderin
      res.status(500).send("Resim indirilemedi.");
    });

  // İçeriği ekleyin

  // PDF belgesini oluşturmak için akışı bitirin
});
routes.post("/add_image", async (req, res) => {
  const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  try {
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
