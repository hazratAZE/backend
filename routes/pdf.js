const express = require("express");
const routes = express.Router();
const PDFDocument = require("pdfkit");
const https = require("https");

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
  } = req.body;

  // PDF belgesini oluştururken hata olup olmadığını kontrol et
  const imageURL =
    "https://worklytest.s3.eu-north-1.amazonaws.com/1700435794488.jpg";

  https
    .get(imageURL, (response) => {
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
module.exports = routes;
