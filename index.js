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
const OCRList = 'units.list';
// Put images in this directory
const inputDir = 'input_images/';
const outputDir = 'output/';


lineReader.eachLine(OCRList, 'utf8', function (imgFullname, last) {
  var regex = /([^\/]+)$/;
  var match = imgFullname.match(regex);
  var filename = match[0];
  const inputFilename = inputDir + filename;
  const outputFilename = outputDir + filename +'.json';
  console.log('Detecting text on: ' + inputFilename);

  // Performs text detection on the local file
  vision.detectText(inputDir + imgFullname, options)
    .then((results) => {
      const detections = results[0];
      //detections.forEach((text) => console.log(text));
      //console.log(JSON.stringify(results));
      fs.writeFile(outputFilename, JSON.stringify(results), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('Write result to: ' + outputFilename);
      });
    })
    .catch((err) => {
      console.error('Vision API ERROR:', err);
    });

});
