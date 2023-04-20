const fs = require('fs');
const { head } = require('request');

fs.readFile('./jsonfile/16_de_Abril_de_2023.json', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const table = JSON.parse(data);
  //console.log(table);
  const headers = table[1];
  headers[0] = 'Products';
  headers[1] = 'Autoservicio_bajo';
  headers[2] = 'Autoservicio_alto';
  headers[3] = 'Mercado_ruedas_bajo';
  headers[4] = 'Mercado_ruedas_alto';
  headers[5] = 'Mercado_publico_bajo';
  headers[6] = 'Mercado_publico_alto';
  headers[7] = 'Ceda_bajo';
  headers[8] = 'Ceda_alto';
  headers[9] = 'Medida';

  const priceRanges = table[2];

  const products = [];
  for (let i = 2; i < table.length; i++) {
    const row = table[i];
    const productDict = {};
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

        productDict[headers[j]] = cell;
      
    }
    products.push(productDict);
  }
  const json = JSON.stringify(products);
  console.log(json);
  fs.writeFile(`./jsonfile/final_productos.json`, json, (err) => {
    if (err) {
      console.error('Error writing to file: ', err);
    } else {
      console.log(`All tables saved to all_tables.json`);
    }
  });
});