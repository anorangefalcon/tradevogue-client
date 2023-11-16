import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root',
})

export class ProductsFilterService {

  constructor(private fetchData: FetchDataService) {}

   getData() {

    // let promise=new Promise(async (resolve,reject)=>{
    //   await this.fetchData.getData().subscribe((originalData)=>{
     
    //     const filterObj: any = {
    //       sizes: [],
    //       colors: [],
    //       category: [],
    //       price: [],
    //       brand: [],
    //       tags: []
    //     };
    
    //     originalData.forEach((data: any) => {
        
    //       for (let filter in (filterObj)) {
          
    //         const target = filter in data ? data : data.info;
        
    //         const value = target[filter];
      
    //         if (Array.isArray(value)) {
         
    //           for (let v of value) {
          
    //             const arr = filterObj[filter];
               
    //             if (!arr.includes(v)) {
    //               arr.push(v);
    //             }
    //           }
    //         }
    //         else {
    //           const arr = filterObj[filter];
    //           if (!arr.includes(value)) {
    //             arr.push(value);
    //           }
    //         }
    //       }
    //     });
    
    //     Object.keys(filterObj).forEach(el => {
        
    //       if (filterObj[el].length > 3) {
    //         filterObj[el].push(false)
    //       }
    //     });

    
     
    //     let result={ originalData, filterObj };
    //     resolve(result);

    //   })  
    // })

    // return promise;
  }

  removeEmptyKeys(filteredObject: any) {
    for (const key in filteredObject) {
     
      if (Array.isArray(filteredObject[key]) && filteredObject[key].length == 0) delete filteredObject[key];
    }
  }

  async Filter(filteredObject: any, OriginalArray: any) {
    
    this.removeEmptyKeys(filteredObject);

    
    // OriginalArray = (await this.getData())
    // OriginalArray=OriginalArray.originalData;

    if (Object.keys(filteredObject).length == 0) {
      return OriginalArray;
    }

    let result = OriginalArray;
    
    
    for (const key in filteredObject) {
      const valuesToFilter = filteredObject[key];
     
    
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