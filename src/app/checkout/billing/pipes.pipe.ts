import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipes'
})
export class PipesPipe implements PipeTransform {

  transform(value: any[], searchText: string): any[] {
    
    console.log("pipe called");
    console.log("search text s ",searchText);
    const search_text=searchText;
    if(searchText=='') return value;
   
   value= value.filter((e)=>{
     
    return  e.toLowerCase().includes(searchText);
   
    })
    console.log("value is ",value);
    return value;
    return value;
  }

}
