import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root',
})

export class ProductsFilterService {

  constructor(private fetchData: FetchDataService) {}

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
        if (Array.isArray(value)) {
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
    });
    return { originalData, filterObj };
  }

  removeEmptyKeys(filteredObject: any) {
    for (const key in filteredObject) {
      console.log(key, Array.isArray(filteredObject[key]));
      if (Array.isArray(filteredObject[key]) && filteredObject[key].length == 0) delete filteredObject[key];
    }
  }

  async Filter2(filteredObject: any, OriginalArray: any) {
    this.removeEmptyKeys(filteredObject);
    console.log('filter is ', filteredObject);

    OriginalArray = (await this.getData()).originalData

    if (Object.keys(filteredObject).length == 0) {
      return OriginalArray;
    }

    let result = OriginalArray?.slice();
    for (const key in filteredObject) {
      const valuesToFilter = filteredObject[key];
      if (valuesToFilter.length == 0) {
        continue;
      }
      result = result.filter((item: any) => {
        if (!item[key]) item = item.info;
        if (Array.isArray(item[key])) {
          return valuesToFilter.some((value: any) => item[key].includes(value));
        } else {
          return valuesToFilter.includes(item[key]);
        }
      });
    }
    return result;
  }
}
