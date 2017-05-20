// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');
const fs = require('fs');
const lineReader = require('line-reader');
var async = require("async");

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

function google_vision_api(imgFullname, vision_callback) {
  async.waterfall([
    // Check file existence
    (callback) => {
      var regex = /([^\/]+)$/;
      var match = imgFullname.match(regex);
      var filename = match[0];
      const inputFilename = inputDir + filename;
      const outputFilename = outputDir + filename + '.json';

      if (fs.existsSync(outputFilename)) {
        const err = '!!! Abort, file already exist ' + outputFilename;
        callback(err);
      }
      else {
        callback(null, inputFilename, outputFilename);
      }
    },
    // Do text detection
    function (inputFilename, outputFilename, callback) {
      console.log('<-- Detecting text on: ' + inputFilename);

      vision.detectText(inputFilename, options)
        .then((results) => {
          const detections = results[0];
          //detections.forEach((text) => console.log(text));
          //console.log(JSON.stringify(results));
          callback(null, results, outputFilename);
        })
        .catch((err) => {
          console.error('!!! ' + '\nVision API ERROR:', err);
          callback(err);
        })
    },

    // Write detection result to file
    (results, outputFilename, callback) => {
      console.log('--> Write result to: ' + outputFilename);

      fs.writeFile(outputFilename, JSON.stringify(results), function (err) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, 'done');
        }
      });
    }
  ],

    (err, status) => {
      // if the above try/catche catches something, we will end up here
      // otherwise we will receive 'done' as the value of status
      // after the third function has finished
      if (err) {
        console.log(err);
      }
      else {
      console.log('status: ' + status);
      }
      vision_callback();
    }
  );
}

var queue = async.queue(google_vision_api, 10);

lineReader.eachLine(OCRList, 'utf8', function (imgFullname, last) {
  queue.push(imgFullname);
});
