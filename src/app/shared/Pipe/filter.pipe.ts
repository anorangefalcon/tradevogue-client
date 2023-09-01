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
    console.log("value inside filter is  ",value);
    
    console.log("filter2fd is ",filter);
    
    // if(filter=='') return value;

  //  return value.filter((el:any)=>{
  //     // el.category
  //    return el.category==filter;
  //   })

    // value.forEach()
    filter.forEach((fil:any)=>{
      // console.log("fil");
      
      let key=Object.keys(fil)[0];
      // console.log("key is ",key);
      

      // console.log("value  is ",fil[key]);
      
     let a=value.filter((val)=>{
      // console.log("val is ",val);
      
        return val[key]==fil[key];
      })

      // console.log("a is ",a);
      value=a;

    })


  //  this.myService.dat 
  return value;
  }

// jhgnjbgfnbjgnbjgdnbjgfnbjgfnbjgnbgfnbjgfnbjgfnbjgfnjbgfnjbngfjbngbjgnbjgfbngfjbgfnjb

  // transform(value: any[], filter: any): any{
  //   console.log(filter);
  //   if(filter == '') return value;
  //   // else{
  //   //   value.filter(()=>{
  //   //     return val
  //   //   })
  //   }
  }

