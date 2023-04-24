// Para usar pdf-text-extract, necesita la siguiente dependencia: pdf-extract
// npm install pdf-extract
// Para MAC: brew install poppler gs tesseract
// Fuente: https://github.com/nisaacson/pdf-extract
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import CSVGenerator from './CSVGenerator';
var extract = require('pdf-text-extract')
var pdf_table_extractor = require("pdf-table-extractor")
moment.locale('es')

// Directorio donde se encuentran los PDFs
const directoryPath = path.join(__dirname, 'pdfs')
// Archivo CSV donde se guardarán los datos de los precios de la canasta básica
const csv = new CSVGenerator('canasta_basica.csv');

// El propósito de eliminar el archivo CSV es para que no se dupliquen los datos
csv.deleteFile();
// Crea un nuevo archivo CSV
csv.createNewFile();

/* La interfaz PageTable define una estructura para un objeto que contiene información acerca de una página en un archivo PDF y sus tablas. 
Tiene dos propiedades: 
1. page, que es un número que representa el número de página
2. tables, que es un arreglo de tablas encontradas en esa página. 
La propiedad tables es de tipo any, lo que significa que puede contener cualquier tipo de datos. */
interface PageTable {
  page: number;
  tables: any;
}

/* La interfaz PageTable define una estructura para un objeto que contiene información acerca de una página
en un archivo PDF y sus tablas. La propiedad pageTables en la interfaz Result es un arreglo de objetos
de PageTable, lo que significa que contiene información acerca de las tablas encontradas en cada página del
archivo PDF. */
interface Result {
  pageTables: PageTable[];
}

async function processFiles(directoryPath: string, files: string[]) {
  for (const file of files) {
    try {
      const pages = await new Promise<string[]>((resolve, reject) => {
        extract(path.join(directoryPath, file), (err: any, pages: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(pages);
          }
        });
      });
      
      const pattern = /(\d{1,2}) de ([a-zA-Z0-9]+) de (\d{4})/;
      const dates: { page: number; date: string; }[] = [];
      
      pages.forEach((page: string, index: number) => {
        const match = page.match(pattern);
        dates.push({
          page: index + 1,
          date: match ? match[0].replace(/juni0/g, 'junio') : dates[dates.length - 1].date
        });
      });
      
      console.table(dates);
      
      const result = await new Promise<Result>((resolve, reject) => {
        pdf_table_extractor(path.join(directoryPath, file), (result: Result) => {
          resolve(result);
        }, (err: string) => {
          reject(err);
        });
      });
      
      result.pageTables.forEach((element) => {
        if (element.tables.slice(2).length > 0) {
          element.tables.slice(2).forEach((row: any) => {
            csv.appendToFile({
              product: row[0],
              unit: row[9].replace(/[^\w]/g, ''), // Sólo lo deja como kilogramos, litros, etc.
              minPrice: row[7].replace("$", ''),
              maxPrice: row[8].replace("$", ''),
              date: moment(dates.find(i => i.page === element.page)?.date, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD')
            });
          });
        }
      });
      
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

// Extrae el contenido de cada PDF
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error al leer el directorio:', err);
    return;
  }
  // El orden de los archivos es importante, para que sea cronológico
  files.sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (numA < numB) {
      return -1;
    } else if (numA > numB) {
      return 1;
    } else {
      return 0;
    }
  });
  // // Recorre los archivos
  processFiles(directoryPath, files);
});

