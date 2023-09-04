import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root',
})

export class ProductsFilterService {

  constructor(private fetchData: FetchDataService) { }

  async getData() {

    const originalData = await this.fetchData.getData().toPromise();
    const filterObj: any = {
      sizes: [],
      colors: [],
      category: [],
      price: [],
      brand: [],
      tags : []
    };

    originalData.map((data: any) => {
      
      for (let filter of Object.keys(filterObj)) {

        if (Object.hasOwn(data.info, filter)) {
          const value = data.info[filter];

          if (Array.isArray(value)) {
            for (let v of value) {
              const arr = filterObj[filter];
              
              if (!arr.includes(v)) {
                arr.push(v);
              }
            }
          } else {
            const arr = filterObj[filter];
            if (!arr.includes(value)) {
              arr.push(value);
            }
          }
        }

        else {
          const value = data[filter];

          if (Array.isArray(value)) {
            for (let v of value) {
              const arr = filterObj[filter];

              if (!arr.includes(v)) {
                arr.push(v);
              }
            }
          } else {
            const arr = filterObj[filter];
            if (!arr.includes(value)) {
              arr.push(value);
            }
          }
        }
      }
    });
    return { originalData, filterObj };
  }
}
