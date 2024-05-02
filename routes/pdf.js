const express = require("express");
const routes = express.Router();
const PDFDocument = require("pdfkit");

routes.post("/generate-pdf", async (req, res) => {
  // PDF oluşturmak için yeni bir PDF belgesi oluştur
  const { name, surname, father } = req.body;
  const doc = new PDFDocument();
  doc.font("./assets/fonts/arial-unicode-ms.ttf");
  // PDF belgesini oluştururken hata olup olmadığını kontrol et
  doc.on("error", (err) => {
    res.status(500).send(err);
  });

  // PDF belgesi oluşturulduğunda tamamlandığını işaret eder
  doc.on("end", () => {
    console.log("PDF oluşturma tamamlandı.");
  });

  // İçeriği ekleyin
  doc.text(`Ad: ${name}: Soyad: ${surname}: Ata adi: ${father}`);

  // PDF belgesini oluşturmak için akışı bitirin
  doc.end();

  // HTTP yanıtı olarak PDF belgesini gönderin
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="generated.pdf"');
  doc.pipe(res);
});
module.exports = routes;
