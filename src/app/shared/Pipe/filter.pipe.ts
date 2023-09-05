import { Pipe, PipeTransform } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
@Pipe({
  name: 'filter',
  pure:true
})
export class FilterPipe implements PipeTransform {


  constructor(private myService: FetchDataService) {}


  transform(value: any[], filter: any): any{
   
    // let arr=['Category 1'];
    if(filter.length==0) return value; 
    console.log("value inside filter is  ",value);
    
    // console.log("filter2fd is ",filter);
    
    
    let last_object=filter[filter.length-1];
    // console.log("last object is ",last_object);
    let key=Object.keys(last_object)[0];
   let a= value.filter((el)=>{
      // return el[]
      return el[key]==last_object[key];
    })
    
    value=a;

    // "500-100"  => [500,1000]
    // filter.forEach((fil:any)=>{

    
      
    //   let key=Object.keys(fil)[0];
    
      
    //  let a=value.filter((val)=>{

      
    //     return val[key]==fil[key];
    //   })

    
    //   value=a;

    // })


   this.myService.data.next(value);
  return value;
  }

// jhgnjbgfnbjgnbjgdnbjgfnbjgfnbjgnbgfnbjgfnbjgfnbjgfnjbgfnjbngfjbngbjgnbjgfbngfjbgfnjb

  // transform(value: any[], filter: any): any{
  //   console.log(filter);
  //   console.log("value is ",value);
    
  //   if((filter.length==0)) return value;
  //   // else{
  //   //   value.filter((value)=>{
  //   //     return value[filter.key] = filter.value;
  //   //   })
  //   // }
  // }
} 
