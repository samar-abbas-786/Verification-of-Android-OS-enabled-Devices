const Tesseract = require("tesseract.js");
const path = require("path");

const imagePath = path.resolve(__dirname, "images/photo.png"); // Ensure this path is correct

function text() {
  Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m), // Optional: Logs the progress
  })
    .then(({ data: { text } }) => {
      return { data: { text } };
      console.log("Extracted Text:", text);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}
module.exports =  text ;
