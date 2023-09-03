import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { NgZone } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ProductsFilterService {
  filters: any = [];
  filterFields: any = [];
  uniqueValues = {};
  ProductData: any = [];
  constructor(private fetchData: FetchDataService) {
  
  }

  async getData() {


    const originalData = await this.fetchData.getData().toPromise();
  
    const filteredObj: any = {
      sizes: [],
      colors: [],
      category: [],
      price: [],
      brand: [],
    
    };

    
    originalData.map((obj: any) => {  

      for (let filter of Object.keys(filteredObj)) {

      
        if (Object.hasOwn(obj.info, filter)) {
          const val = obj.info[filter];

          if (Array.isArray(val)) {
            for (let v of val) {
              const x = filteredObj[filter];
              if (!x.includes(v)) {
                x.push(v);
              }
            }
          } else {
            const x = filteredObj[filter];
            if (!x.includes(val)) {
              x.push(val);
            }
          }
        } 
        
        else {
          const val = obj[filter];

          if (Array.isArray(val)) {
            for (let v of val) {
              const x = filteredObj[filter];

              if (!x.includes(v)) {
                x.push(v);
              }
            }
          } else {
            const x = filteredObj[filter];
            if (!x.includes(val)) {
              x.push(val);
            }
          }
        }
      }

     
    });



    console.log(" filter ",filteredObj);
    
    // this.ProductData=originalData;
    // this.uniqueValues=filteredObj;
    return {originalData,filteredObj};
    
    // return;
    
   
  }
}
