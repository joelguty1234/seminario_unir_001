import fs from 'fs';

interface IPriceData {
  product: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  date: string;
}

class CSVGenerator {
  private readonly _header: string;
  private readonly _fileName: string;

  constructor(fileName: string) {
    this._fileName = fileName;
    this._header = 'Fecha,Producto,Unidad de Medida,Precio Mínimo,Precio Máximo\n';
  }

  public createNewFile(): void {
    fs.writeFileSync(this._fileName, this._header, { encoding: 'utf8' });
  }

  public appendToFile(data: IPriceData): void {
    const row = `${data.date},${data.product},${data.unit},${data.minPrice},${data.maxPrice}\n`;
    fs.appendFileSync(this._fileName, row, { encoding: 'utf8' });
  }

  public deleteFile(): void {
    if (fs.existsSync(this._fileName)) {
      fs.unlinkSync(this._fileName);
    }
  }
}

export default CSVGenerator;