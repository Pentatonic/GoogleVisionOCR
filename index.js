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
  var regex = /([^\/]+)$/;
  var match = imgFullname.match(regex);
  var filename = match[0];
  const outputFilename = outputDir + filename + '.json';

  async.waterfall(
    // tasks
    [
      // Check file existence
      (callback) => {
        if (fs.existsSync(outputFilename)) {
          const err = '!!! Abort, file already exist ' + outputFilename;
          callback(err);
        }
        else {
          callback(null);
        }
      },

      // resize those files > 4MB
      (callback) => {
        var inputFilename = inputDir + filename;
        const stats = fs.statSync(inputFilename);
        const fileSizeInMB = stats.size / 1024 / 1024;
        //console.log('Check file size: ' + inputFilename);

        if (fileSizeInMB > 3.9) {
          var sharp = require('sharp');
          const newInputFilename = inputDir + '_' + filename;
          sharp(inputFilename)
            .resize(2048)
            .toFile(newInputFilename, (err, info) => {
              if (err) {
                callback(err);
              }
              else {
                callback(null, newInputFilename);
              }
            });
        }
        else {
          callback(null, inputFilename);
        }
      },

      // Do text detection
      (inputFilename, callback) => {
        console.log('<-- Detecting text on: ' + inputFilename);

        vision.detectText(inputFilename, options)
          .then((results) => {
            const detections = results[0];
            //detections.forEach((text) => console.log(text));
            callback(null, results);
          })
          .catch((err) => {
            console.error('!!! ' + '\nVision API ERROR:', err);
            callback(err);
          })
      },

      // Write detection result to file
      (results, callback) => {
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

    // if the above try/catch catches something, we will end up here
    // otherwise we will receive 'done' as the value of status
    // after the third function has finished
    (err, status) => {

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
