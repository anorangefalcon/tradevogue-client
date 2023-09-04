import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent {
  product: any = {};
  products: any[] = [];
  errors: any = {};

  // handles inputed files
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

      // final array of json objects
      for (let sheetName of sheetNames) {
        excelData[sheetName] = (XLSX.utils.sheet_to_json(workSheets[sheetName]));
        excelData[sheetName].forEach((element: any) => {
          element['row'] = element['__rowNum__'];
        });
      }
      console.log("excel-> ", excelData);

      this.validateFile(excelData);
    }
  }

  // main magic happens here
  validateFile(data: any) {
    const reqProductKeys: any = [
      'name',
      'price',
      'image',
      'sizes',
      'colors',
      'description',
      'stockQuantity',
      'orderQuantity',
      'productCode',
      'category',
      'subTitle',
      'brand',
      'weight',
      'composition',
      'tags',
    ];
    this.errors = {}

    for (let sheet of Object.keys(data)) {
      console.log(sheet, "Sheet");

      this.errors[sheet] = {
        warning: {
          notRequired: {}
        },
        rejected: {
          insuffiecientImages: [],
          insuffeciientFeilds: {},
        }
      };

      data[sheet].forEach((obj: any) => {
        let shouldContinue = true;
        // reseting product object
        this.product = {
          sku: '',
          name: '',
          price: undefined,
          oldPrice: 0,
          image: [],
          sizes: [],
          colors: [],
          description: '',
          stockQuantity: undefined,
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
        // converting object keys to camelCase
        obj = this.keysToLowerCase(obj);

        // checking if all required keys are present
        const allReqKyes = this.isCompleteSubset(Object.keys(obj), reqProductKeys);

        if (allReqKyes === true) {
          for (let key of Object.keys(obj)) {
            // not letting user set important keys explicitly
            if (key !== 'reviews' && key !== 'available' && key !== 'sku' && key !== 'row') {
              // finding where key exists in schema & skipped random not required key
              const target = key in this.product ? this.product : (key in this.product.info ? this.product.info : null);

              // saving warning for the extra(non-req) feilds in excel
              if (target === null) {
                shouldContinue = false;

                if (!this.errors[sheet]['warning']['notRequired'][key]) {
                  this.errors[sheet]['warning']['notRequired'][key] = [];
                }
                this.errors[sheet]['warning']['notRequired'][key].push(obj['row']);
                continue;
              }

              // for array type data such as image, sizes, colors, tags etc.
              if (Array.isArray(target[key])) {

                const tempObjArr = obj[key].split(',');

                for (let tempObj of tempObjArr) {
                  target[key].push(tempObj.trim());
                }

                // saving error for rows with insufficient images
                if (key === 'image' && target[key].length < 3) {
                  shouldContinue = false;

                  if (!this.errors[sheet]['rejected']['insuffiecientImages']) {
                    this.errors[sheet]['rejected']['insuffiecientImages'] = [];
                  }
                  this.errors[sheet]['rejected']['insuffiecientImages'].push(obj['row'] + 1);
                }
              }
              else {
                target[key] = obj[key];
              }
            }
          };

          if (shouldContinue) {
            this.products.push(JSON.parse(JSON.stringify(this.product)));
          }
        }

        else {
          // saving error for rows with missing required feilds
          if (!this.errors[sheet]['rejected']['insuffeciientFeilds'][obj['row']]) {
            this.errors[sheet]['rejected']['insuffeciientFeilds'][obj['row']] = [];
          }
          this.errors[sheet]['rejected']['insuffeciientFeilds'][obj['row']] = allReqKyes['missing'];
        }

      });
    }

    console.log(this.products, "Products");

    console.log(this.errors);
  }

  // helper functions
  keysToLowerCase(obj: any) {
    var keys = Object.keys(obj);
    var n = keys.length;
    var lowKeyObject: any = {};
    while (n--) {
      var key = keys[n];
      lowKeyObject[key.toLowerCase().trim().split(" ").reduce((before, after) => {
        return before + after.charAt(0).toUpperCase() + after.slice(1);
      })] = obj[key];
    }

    return lowKeyObject;
  }

  isCompleteSubset(array1: any, array2: any) {
    const set1: any = new Set(array1);
    const set2: any = new Set(array2);

    const missingElements: any = [];

    for (const element of set2) {
      if (!(set1.has(element))) {
        missingElements.push(element);
      }
    }

    if (missingElements.length > 0) {
      return {
        result: false,
        missing: missingElements
      };
    }
    return true;
  }

}