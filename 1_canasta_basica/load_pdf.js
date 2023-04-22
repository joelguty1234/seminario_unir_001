const cheerio = require("cheerio");
var request = require('request');
var fs = require('fs');
const axios = require("axios");

const url = "https://www.sedeco.cdmx.gob.mx/servicios/servicio/seguimiento-de-precios-de-la-canasta-basica"
const day_canasta = []; 
const base_url = "https://www.sedeco.cdmx.gob.mx"

try {
    path = './pdfs_local/'
    // Read the directory given in `path`
    const files = fs.readdir(path, (err, files) => {
      if (err)
        throw err;
  
      files.forEach((file) => { 
        // Check if the file is with a PDF extension, remove it
        if (file.split('.').pop().toLowerCase() == 'pdf') {
          console.log(`Deleting file: ${file}`);
          fs.unlinkSync(path + file)
        }
      });
    });

    path2 = './jsonfile/'
    // Read the directory given in `path`
    const files2 = fs.readdir(path2, (err, files) => {
      if (err)
        throw err;
  
      files.forEach((file) => { 
        // Check if the file is with a PDF extension, remove it
        if (file.split('.').pop().toLowerCase() == 'json') {
          console.log(`Deleting file: ${file}`);
          fs.unlinkSync(path2 + file)
        }
      });
    });
  } catch (err) {
    console.error(err);
  }

async function getGenre(){
    try{
        const response = await axios.get(url);
        const $=cheerio.load(response.data)
        const canasta_v = $('ul li strong');
        canasta_v.each(function(){
            dia = $(this).find("a.fr-file").text();
            url_lin = $(this).find("a.fr-file").attr("href");
            url_lin = base_url + url_lin
            
            if (dia.length > 0 && (dia.startsWith('0')
            || dia.startsWith('1') || dia.startsWith('2')
            || dia.startsWith('3') )){
                day_canasta.push({dia,url_lin})
            }
            
        })

        const path_url = (day_canasta[day_canasta.length - 1].dia).replaceAll(" ", "_")
        
        downloadFile(day_canasta[day_canasta.length - 1].url_lin, 1 ,
          path_url)
        

        return path_url;
    }
    catch(error){
        console.error(error);
    }

    let data_pdf = await (day_canasta[day_canasta.length - 1].dia).replaceAll(" ", "_")
    //console.log(data_pdf)
    return await data_pdf
}

const res = async () => {
    const salida = await getGenre();
    console.log(`Inserting File: `,salida)
    return salida
  }

  module.exports = res()



function  downloadFile(path, index, fileName) {
    const folderPath = './pdfs_local/';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const filePath = folderPath + fileName;
    request(path).pipe(fs.createWriteStream(filePath).on('close', () => {
      //console.log(index + ':Done');
    }));
  }