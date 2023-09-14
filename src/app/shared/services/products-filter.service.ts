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
      tags: []
    };

    originalData.map((data: any) => {

      for (let filter of Object.keys(filterObj)) {

        const target = filter in data ? data : data.info;
        const value = target[filter];
        if(Array.isArray(value)) {
          for (let v of value) {
            const arr = filterObj[filter];

            if (!arr.includes(v)) {
              arr.push(v);
            }
          }
        }
        else {
          const arr = filterObj[filter];
          if (!arr.includes(value)) {
            arr.push(value);
          }
        }
      }
    });

    Object.keys(filterObj).forEach(el => {

      if (filterObj[el].length > 3) {
        filterObj[el].push(false)
      }
    })
    return { originalData, filterObj };
  }
}
