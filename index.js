// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
const fs = require('fs');
const lineReader = require('line-reader');

// Instantiates a client
const credentials = [
  {
    projectId: 'react-google-maps',
    keyFilename: 'react-google-maps-476def2de5c2.json',
  },
  {
    projectId: 'nimble-answer-165506',
    keyFilename: 'Tutorial Project-e98b0d21b706.json',
  },
];

const vision = Vision(
  credentials[0]
  // credentials[1]
);

const options = {
  imageContext:
  {
    languageHints: [
      'zh-TW'
    ]
  }
};

// open OCR list file
var OCRList = "units.list";
var encode = "utf8";

lineReader.eachLine(OCRList, encode, function (imgFullname, last) {
  var regex = /([^\/]+)$/;
  var match = imgFullname.match(regex);
  var filename = match[0];
  console.log(imgFullname);

  var outputName = "./OCRText/" + filename + ".txt";
  console.log("Recognition to " + outputName);

  // Performs text detection on the local file
  vision.detectText(imgFullname, options)
    .then((results) => {
      const detections = results[0];
      //detections.forEach((text) => console.log(text));

      fs.writeFile(outputName, detections, function (err) {
        if (err) {
          return console.log(err);
        }
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
});
