import fs from 'fs';
import path from 'path';
import request from 'request';

const baseUrl: string = 'https://www.sedeco.cdmx.gob.mx/storage/app/media/Canasta%20Basica/';
const pdfUrls: string[] = [
  // '2021/precios-de-la-canasta-basica-2021.pdf', // Lo descarté porque hay demasiadas inconsistencias en los datos
  '2022/preciosdelacanastabasica2022.pdf',
  '2023/Enero%202023.pdf',
  '2023/Febrero%202023.pdf',
  '2023/Marzo/Marzo%202023.pdf',
  '2023/Abril/01%20de%20Abril%20de%202023.pdf',
  '2023/Abril/02%20de%20Abril%20de%202023.pdf',
  '2023/Abril/03%20de%20Abril%20de%202023.pdf',
  '2023/Abril/04%20de%20Abril%20de%202023.pdf',
  '2023/Abril/05%20de%20Abril%20de%202023.pdf',
  '2023/Abril/06%20de%20Abril%20de%202023.pdf',
  '2023/Abril/07%20de%20Abril%20de%202023.pdf',
  '2023/Abril/08%20de%20Abril%20de%202023.pdf',
  '2023/Abril/09%20de%20Abril%20de%202023.pdf',
  '2023/Abril/10%20de%20Abril%20de%202023.pdf',
  '2023/Abril/11%20de%20Abril%20de%202023.pdf',
  '2023/Abril/12%20de%20Abril%20de%202023.pdf',
  '2023/Abril/13%20de%20Abril%20de%202023.pdf',
  '2023/Abril/14%20de%20Abril%20de%202023.pdf',
  '2023/Abril/15%20de%20Abril%20de%202023.pdf',
  '2023/Abril/16%20de%20Abril%20de%202023.pdf',
  '2023/Abril/17%20de%20Abril%20de%202023.pdf',
  '2023/Abril/18%20de%20Abril%20de%202023.pdf',
  '2023/Abril/19%20de%20Abril%20de%202023.pdf',
  '2023/Abril/20%20de%20Abril%20de%202023.pdf',
  '2023/Abril/21%20de%20Abril%20de%202023.pdf',
  '2023/Abril/22%20de%20Abril%20de%202023.pdf',
  '2023/Abril/23%20de%20Abril%20de%202023.pdf'
];

const pdfDirectory: string = path.join(__dirname, 'pdfs');

if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory);
}

pdfUrls.forEach((url: string, index: number) => {
  const filePath: string = path.join(pdfDirectory, `${index + 1}.pdf`);
  request(`${baseUrl}${url}`).pipe(fs.createWriteStream(filePath)).on('close', () => {
    console.log(`PDF ${index + 1} descargado exitosamente.`);
  });
});