const pdf_table_extractor = require("pdf-table-extractor");
const fs = require('fs');
const path = require('path');

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


function success(result) {
  const allTables = [];
  for (let i = 0; i < result.pageTables.length; i++) {
    const pageTables = result.pageTables[i];
    for (let j = 0; j < pageTables.tables.length; j++) {
      allTables.push(pageTables.tables[j]);
    }
  }
  const json = JSON.stringify(allTables);

  fs.writeFile(`./jsonfile/${pdfFiles}.json`, json, (err) => {
    if (err) {
      console.error('Error writing to file: ', err);
    } else {
      console.log(`All tables (${allTables.length}) saved to all_tables.json`);
    }
  });
}


function error(err) {
  console.error('Error extracting tables from PDF: ', err);
}

const pdfPath = `./pdfs_local/${pdfFiles}.pdf`;

pdf_table_extractor(pdfPath, success, error);
