import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent {

  product = {
    sku: '',
    name: '',
    price: undefined,
    oldPrice: undefined,
    image: [],
    sizes: [],
    colors: [],
    description: '',
    stockQuantity: 0,
    orderQuantity: [],
    info: {
      productCode: '',
      category: '',
      subTitle: '',
      brand: '',
      weight: '',
      composition: '',
      tags: [],
    },
    available: true,
    reviews: [
      {
        username: '',
        rating: 0,
        comment: '',
        date: ''
      }
    ]
  }
  products = [];

  handleFileInput(event: any) {
    let file = event.target.files[0];
    const excelData: any = {};

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      const fileContent = e?.target?.result;

      const workbook = XLSX.read(fileContent, { type: 'binary' });
      // contains ref to multiple worksheets[]
      const workSheets = workbook.Sheets;
      // array containing names of sheets inside worksheets
      let sheetNames = Object.keys(workSheets);
      if (sheetNames.length > 1) {
        sheetNames.splice(0, 1);
      }

      // final array of json objects
      for (let sheetName of sheetNames) {
        excelData[sheetName] = (XLSX.utils.sheet_to_json(workSheets[sheetName]));
      }
      console.log(excelData, "Excel");
      // console.log(this.product, "Product, 1");

      this.validateFile(excelData);
    }
  }


  validateFile(data: any) {
    let errors: any = {};
    const productKeys = Object.keys(this.product);
    // console.log(productKeys, "Product Keys");

    for (let sheet of Object.keys(data)) {
      data[sheet].forEach((obj: any) => {
        
      })
    }

    console.log(errors);
  }

}