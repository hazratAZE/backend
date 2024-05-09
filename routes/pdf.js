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
        doc.fillAndStroke("#0e8cc3").lineWidth(20);
        doc.image(imageData, doc.page.width - 170, 160, {
          fit: [100, 100], // Resmin boyutu
          align: "center", // Ortalama
          valign: "top", // En üstte
        });
        doc
          .fontSize(20)
          .fillColor("#333")
          .text(`${name} ${surname}`, { align: "center" });
        doc.fontSize(14).fillColor("#666").text(position, { align: "center" });
        doc.lineWidth(4);
        doc.fillAndStroke("#75bfec");
        doc.strokeOpacity(0.2);
        doc
          .moveTo(70, 130) // Başlangıç noktası
          .lineTo(doc.page.width - 70, 130) // Bitiş noktası
          .stroke();
        doc.moveDown(1);
        // Kişisel Bilgiler
        doc
          .fontSize(16)
          .fillColor("#75bfec")
          .text("Şəxsi məlumatlar", { wordSpacing: 2 });

        doc.moveDown(0.2);
        doc.fontSize(8).fillColor("gray").text(`Doğum tarixi`);
        doc.fontSize(10).fillColor("#000").text(date_of_birth);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(`Ünvan`);
        doc.fontSize(10).fillColor("#000").text(address);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(`Telefon`);
        doc.fontSize(10).fillColor("#000").text(phone);
        doc.moveDown(0.1);
        doc.fontSize(8).fillColor("gray").text(`E-mail`);
        doc.fontSize(10).fillColor("#000").text(email.toLowerCase());
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
        doc.fontSize(8).fillColor("gray").text(`Sürücülük vəsiqəsi`);
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(drive == "Yes" ? "Beli" : "Xeyr");
        doc.moveDown();

        // Eğitim Bilgileri
        doc.fontSize(16).fillColor("#75bfec").text("Təhsil");
        doc.moveDown(0.2);
        doc.fontSize(8).fillColor("gray").text(`Təhsil aldığı yer`);
        doc.fontSize(10).fillColor("#000").text(firstEdu.name);
        doc.fontSize(8).fillColor("gray").text(`Ixtisas`);
        doc.fontSize(10).fillColor("#000").text(firstEdu.position);
        doc.fontSize(8).fillColor("gray").text(`Təhsil illəri`);
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(`${firstEdu.startDate} - ${firstEdu.endDate}`);
        doc.moveDown(0.5);
        if (secondEdu.name) {
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Təhsil aldığı yer: ${secondEdu.name}`);
          doc.fontSize(10).text(`Ixtisas: ${secondEdu.position}`);
          doc
            .fontSize(10)
            .text(
              `Təhsil illəri: ${secondEdu.startDate} - ${secondEdu.endDate}`
            );
          doc.moveDown(0.2);
        }
        if (thirdEdu.name) {
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Təhsil aldığı yer: ${thirdEdu.name}`);
          doc.fontSize(10).text(`Ixtisas: ${thirdEdu.position}`);
          doc
            .fontSize(10)
            .text(`Təhsil illəri: ${thirdEdu.startDate} - ${thirdEdu.endDate}`);
          doc.moveDown(0.5);
        }

        // İş Deneyimleri
        doc.fontSize(14).fillColor("#75bfec").text("İş təcrübəsi");
        doc.moveDown(0.2);
        doc
          .fontSize(10)
          .fillColor("#666")
          .text(`İş Yeri: ${firstWork.company}`);
        doc
          .fontSize(10)
          .fillColor("#666")
          .text(`Vezife: ${firstWork.companyName}`);
        doc
          .fontSize(10)
          .text(`İş Yılları: ${firstWork.startDate} - ${firstWork.endDate}`);
        doc
          .fontSize(10)
          .fillColor("#666")
          .text(`Is haqqinda: ${firstWork.aboutJob}`);
        doc.moveDown();
        if (secondWork.company) {
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`İş Yeri: ${secondWork.company}`);
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Vezife: ${secondWork.companyName}`);
          doc
            .fontSize(10)
            .text(
              `İş Yılları: ${secondWork.startDate} - ${secondWork.endDate}`
            );
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Is haqqinda: ${secondWork.aboutJob}`);
          doc.moveDown();
        }
        if (thirdWork.company) {
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`İş Yeri: ${thirdWork.company}`);
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Vezife: ${thirdWork.companyName}`);
          doc
            .fontSize(10)
            .text(`İş Yılları: ${thirdWork.startDate} - ${thirdWork.endDate}`);
          doc
            .fontSize(10)
            .fillColor("#666")
            .text(`Is haqqinda: ${thirdWork.aboutJob}`);
          doc.moveDown();
        }

        // Beceriler
        doc.fontSize(14).fillColor("#75bfec").text("Bacarıqlar");
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
        doc.moveDown(0.2);

        // Diller
        doc.fontSize(14).fillColor("#75bfec").text("Dillər");
        doc.moveDown(0.2);
        langList.forEach((lang) => {
          doc
            .fillColor("#666")
            .fontSize(10)
            .text(`${lang.name} - ${lang.level}`);
        });
        doc.moveDown();

        // Ödüller
        if (awardList.length > 0) {
          doc.fontSize(14).fillColor("#75bfec").text("Mükafatlar");
          doc.moveDown(0.2);
          awardList.forEach((award) => {
            doc
              .fillColor("#666")
              .fontSize(10)
              .text(`${award.name} - ${award.date}`);
          });
          doc.moveDown();
        }

        // Sertifikalar
        if (ceritificates.length > 0) {
          doc.fontSize(14).fillColor("#75bfec").text("Sertifikatlar");
          doc.moveDown(0.2);
          ceritificates.forEach((cert) => {
            doc
              .fillColor("#666")
              .fontSize(10)
              .text(`${cert.name} - ${cert.date}`);
          });
          doc.moveDown();
        }

        // Ek Bilgi
        doc.fontSize(14).fillColor("#75bfec").text("Əlavə");
        doc.moveDown(0.2);
        doc.fillColor("#666").fontSize(10).text(about);

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
