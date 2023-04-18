const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Create a new storage client
const storage = new Storage();

// Set the name of the bucket you want to upload the file to
const bucketName = 'test_yaku_001';

function getPDFFiles(directoryPath) {
    const pdfFiles = [];
  
    fs.readdirSync(directoryPath).forEach(function(file) {
      if (path.extname(file) === '.pdf') {
        const filenameWithoutExt = path.basename(file, '.pdf');
        pdfFiles.push(filenameWithoutExt);
      }
    });
  
    return pdfFiles;
  }
  
  let pdfFiles = getPDFFiles('./pdfs_local')[0];

// Set the path to the JSON file on your local machine
const localFilePath = `./jsonfile/${pdfFiles}.json`;

// Set the destination name for the file in Google Cloud Storage
const destinationName = `/seminario_001/${pdfFiles}.json`;

// Get a reference to the bucket
const bucket = storage.bucket(bucketName);

// Upload the file to the bucket
bucket.upload(localFilePath, {
  destination: destinationName,
}).then(() => {
  console.log(`${localFilePath} uploaded to ${bucketName}/${destinationName}.`);
}).catch((err) => {
  console.error(`Error uploading ${localFilePath} to ${bucketName}/${destinationName}: ${err}`);
});
