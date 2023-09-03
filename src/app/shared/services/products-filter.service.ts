import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsFilterService {

  filters: any = [];
  filterFields: any = [];
  uniqueValues = {}
  ProductData:any=[];
  constructor(private fetchData: FetchDataService) {
    this.ProductData=this.getData();
   
  }


async getData(){
//  const x=await this.fetchData.getData().subscribe((data) => {

//     this.filters = ["sizes", "colors", "brand", "category", "price"];

//     const filteredObj: any = {};
//     this.filterFields = data.map((obj: any) => {

//       for (let filter of this.filters) {
//         console.log("genjvnfjv");
        
//         if (Object.hasOwn(obj.info, filter)) {
//           console.log("fulter is ",filter);
          
//           filteredObj[filter] = obj.info[filter];
//           console.log("filterobject is ",filteredObj);
          
//         }
//         else {
//           filteredObj[filter] = obj[filter];
//         }
//       }



//       console.log("filterdata  is  ",this.filterFields);
      
//       return JSON.parse(JSON.stringify(filteredObj));
//     });
//     console.log(this.filterFields);
//   })


const x = await this.fetchData.getData().toPromise();
// console.log("x is ",x);
this.filters = ["sizes", "colors", "brand", "category", "price"];

    const filteredObj: any = {"sizes":[],"colors":[],"category":[],"price":[],"brand":[]};
     x.map((obj: any) => {
      // console.log("x ibside ");
      
      for (let filter of this.filters) {
        

        const val= obj.info[filter];

        if (Object.hasOwn(obj.info, filter)) {
          // console.log("fulter is ",filter);
        
          // console.log("val is ",val);
          
          if(Array.isArray(val)){
            for (let v in val){
              // console.log("");
              // filter="sizes";
              
              // console.log(filteredObj[filter]," vjnvjfnjfv");
              const x=filteredObj[filter];
              if(!x.includes(val)){
                x.push(val);
              }
              // if(!filteredObj[filter].includes(val)){ filteredObj[filter].push(val);  }
            }
          }

          else{

            // console.log)
            // filter="sizes";
            
            const x=filteredObj[filter];
            if(!x.includes(val)){
              x.push(val);
            }
            
            // console.log(filteredObj[filter]," vjnvjfnjfv" , " filter ",filter);
            // if(!filteredObj[filter].includes(val)){ filteredObj.filter.push(val); }
          }
        
         
          
        }
        else {

          // console.log("Val ue ois ",val , " filter is ",filter);
          const val= obj[filter];

          if(Array.isArray(val)){
            for (let v in val){
              // console.log("");
              // filter="sizes";
              
              // console.log(filteredObj[filter]," vjnvjfnjfv");
              const x=filteredObj[filter];
              if(!x.includes(val)){
                x.push(val);
              }
              // if(!filteredObj[filter].includes(val)){ filteredObj[filter].push(val);  }
            }
          }

          else{

            // console.log)
            // filter="sizes";
            
            const x=filteredObj[filter];
            if(!x.includes(val)){
              x.push(val);
            }
            
            // console.log(filteredObj[filter]," vjnvjfnjfv" , " filter ",filter);
            // if(!filteredObj[filter].includes(val)){ filteredObj.filter.push(val); }
          }
        
      
        }
      }


      console.log("filterobj is ",filteredObj);
      



})



// console.log("filterobj ius ",filteredObj);


}

}




 






