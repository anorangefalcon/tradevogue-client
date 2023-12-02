import * as XLSX from 'xlsx';

export class UploadExcelService {

  constructor() { }

  product: any = {};
  products: any[] = [];
  errors: any = {};

  // handles inputed files
  handleFileInput(event: any, singleField: string = ''): Promise<any> {

    let dataAndErrors: any = {};
    let file = event.target.files[0];
    const excelData: any = {};

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    return new Promise((resolve, reject) => {
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

        if (singleField !== '') {
          dataAndErrors = this.validateSingleFeildFile(excelData, singleField);
        }
        else {
          dataAndErrors = this.validateFile(excelData);
        }
        resolve(dataAndErrors);
      }
    });

  }

  productModel: any = {};

  // main magic happens here
  validateFile(data: any) {

    let sheetKeys = Object.keys(data);
    this.errors = [];
    sheetKeys.forEach((sheetKey: any) => {
      let rowIndex = 0;
      data[sheetKey].forEach((item: any) => {
        rowIndex++;

        this.productModel = {
          name: '',
          subTitle: '',
          description: '',

          assets: [
            // {
            //   color: '',
            //   stockQuantity: [{
            //     size: '',
            //     quantity: 0,
            //     unitSold: 0
            //   }],
            //   photo: []
            // }
          ],
          info: {
            code: '',
            category: '',
            gender: '',
            brand: '',
            weight: '',
            composition: '',
            tags: [],
            orderQuantity: [],
          },
          price: 0,
          costPrice: 0,
        }

        Object.keys(this.productModel).forEach((modelKey: any) => {
          if (modelKey == 'info') {
            Object.keys(this.productModel['info']).forEach((infoKey: any) => {
              if (Array.isArray(this.productModel['info'][infoKey])) {
                if (infoKey == 'orderQuantity') {
                  item[infoKey] = item[infoKey].split(',').map((i: any) => parseInt(i.trim()));
                }
                else {
                  item[infoKey] = item[infoKey].split(',').map((i: any) => i.trim());
                }
              }
              this.productModel['info'][infoKey] = item[infoKey];
            });
          }
          else if (modelKey == 'assets') {
            let colorKeys = Object.keys(item).filter((i: any) => i.includes('color'));
            const variant = {
              color: '',
              photo: [],
              stockQuantity: [{
                size: '',
                quantity: 0,
              }]
            };

            colorKeys.forEach((colorKey: any) => {
              let variantNumber = colorKey.split('_')[1] ? ('_' + colorKey.split('_')[1]) : '';

              variant.color = item[colorKey];
              variant.photo = item['photo' + variantNumber] ? (item['photo' + variantNumber]).split(',').map((i: any) => i.trim()) : [];

              variant.stockQuantity = [];
              let size_quantity = item['size:quantity' + variantNumber] ? (item['size:quantity' + variantNumber]).split(',').map((i: any) => i.trim()) : [];
              size_quantity.forEach((sq: any) => {
                let sqArr = sq.split(':').map((i: any) => i.trim());
                variant.stockQuantity.push({
                  size: sqArr[0],
                  quantity: parseInt(sqArr[1])
                });
              })

              this.productModel.assets.push(JSON.parse(JSON.stringify(variant)));
            })
          }
          else {
            this.productModel[modelKey] = item[modelKey];
          }
        })

        if (!(this.errorHandler(this.productModel))) {
          this.errors.push({
            row: rowIndex,
            sheet: sheetKey
          });
        }
        else {
          this.products.push(this.productModel);
        }
      });

    });

    return {
      data: this.products,
      errors: this.errors
    }
  }

  errorHandler(product: any): any {
    for (const key of Object.keys(product)) {
      if ((key === 'photo') && !(product[key].length >= 2 && product[key].length <= 6)) {
        return false;
      }

      if (!product[key]) {
        return false;
      }
      else if (Array.isArray(product[key])) {
        for (const pro of product[key]) {
          if (!this.errorHandler(pro)) return false;
        }
      }
      else if (typeof product[key] === 'object') {
        if (!(this.errorHandler(product[key]))) return false;
      }
    }
    return true;
  }

  // now lets make same function as validate file but for files only containing one feild like brand
  validateSingleFeildFile(data: any, singleFeild: string) {
    singleFeild = singleFeild.toLowerCase();
    const reqProductKeys: any = [singleFeild];
    this.errors = {};
    let reqData: any = [];

    for (let sheet of Object.keys(data)) {
      this.errors[sheet] = {
        warning: {
          notRequired: {}
        },
        rejected: {
          empty: [],
        }
      };

      data[sheet].forEach((obj: any) => {
        obj = this.keysToLowerCase(obj);
        const allReqKeys = this.isCompleteSubset(Object.keys(obj), reqProductKeys);

        if (allReqKeys === true) {
          if (!reqData.includes((obj[singleFeild].toString()).trim())) {
            reqData.push((obj[singleFeild].toString()).trim());
          }
        }
        else {
          if (!this.errors[sheet]['rejected']['empty']) {
            this.errors[sheet]['rejected']['empty'] = [];
          }
          this.errors[sheet]['rejected']['empty'].push(obj['row']);
        }
      });

    }
    return {
      data: reqData,
      errors: this.errors
    }
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

  exportProductsInExcel(exportArr: any) {
    let finalArr: any[] = [];
    exportArr.forEach((item: any) => {
      let tempObj: any = {};

      tempObj.name = item.name;
      tempObj.subTitle = item.subTitle;
      tempObj.description = item.description
      tempObj.costPrice = item.costPrice;
      tempObj.price = item.price;

      // nested
      tempObj.code = item.info.code;
      tempObj.category = item.info.category;
      tempObj.brand = item.info.brand;
      tempObj.gender = item.info.gender;
      tempObj.weight = item.info.weight;
      tempObj.composition = item.info.composition;

      // arays
      // tempObj.tags = item.info.tags;
      tempObj.tags = item.info.tags.reduce((tags: String, tag: String) => {
        tags += tag + ', ';
        return tags;
      }, '');
      if (tempObj.tags) tempObj.tags = tempObj.tags.slice(0, -2);

      tempObj.orderQuantity = item.info.orderQuantity.reduce((orderQuantities: String, orderQuantity: String) => {
        orderQuantities += orderQuantity + ', ';
        return orderQuantities;
      }, '');
      if (tempObj.orderQuantity) tempObj.orderQuantity = (tempObj.orderQuantity).slice(0, -2);


      // asset variants
      let variantIndex = 0;
      let keys = ['color', 'photo', 'size:quantity'];
      item.assets.forEach((variant: any) => {

        keys.forEach((key: any) => {
          let exKey = key;
          if (variantIndex > 0) exKey = key + '_' + variantIndex;

          if (key.includes('size:quantity')) {
            tempObj[exKey] = variant.stockQuantity.reduce((accumulator: any, stock: any) => {
              accumulator += stock.size + ':' + stock.quantity + ', ';
              return accumulator;
            }, '');
            if (tempObj[exKey]) tempObj[exKey] = tempObj[exKey].slice(0, -2);
          }
          else {
            if(Array.isArray(variant[key])){
              tempObj[exKey] = variant[key].reduce((variants: String, variant: String) => {
                variants += variant + ', ';
                return variants;
              }, '');
              if (tempObj[exKey]) tempObj[exKey] = (tempObj[exKey]).slice(0, -2);
            }
            else tempObj[exKey] = variant[key];
          }
        });
        variantIndex++;
      })

      finalArr.push(tempObj);
    })

    let finalJSON = XLSX.utils.json_to_sheet(finalArr);

    var workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, finalJSON, 'Products')

    XLSX.writeFile(workBook, 'Exported-Products.xlsx');
  }

}



// how to use this service template:
/*
<input type="file" accept=".xlsx, .csv" (change)="fileUpload($event)">

constructor(private uploadExcelService: UploadExcelService) { }

  // for entire data
  fileUpload(event: any) {
    const errors = this.uploadExcelService.handleFileInput(event);
    errors.then((data: any) => {
    });
  }

  // for a particular feild
  fileUpload(event: any) {
    const errors = this.uploadExcelService.handleFileInput(event, 'brand');
    errors.then((data: any) => {
    });
  }

  data returns object containing:
  {
    data: {}/[],
    errors: {}
  }
*/