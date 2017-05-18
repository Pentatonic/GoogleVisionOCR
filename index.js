// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Instantiates a client
const vision = Vision(
  {
    projectId: 'react-google-maps',
    keyFilename: 'react-google-maps-476def2de5c2.json',
  }
);

// The path to the local image file, e.g. "/path/to/image.png"
const fileName = 'input.jpg';

const options = {
  imageContext:
  {
    languageHints: [
      'zh-TW'
    ]
  }
};
// Performs text detection on the local file
vision.detectText(fileName, options)
  .then((results) => {
    const detections = results[0];

    console.log('Text:');
    detections.forEach((text) => console.log(text));
    // console.log(JSON.stringify(detections));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
