import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessThanOrEqual'
})
export class LessThanOrEqualPipe implements PipeTransform {

  transform(array: any[], limit: number): number[] {    
    let filteredArray = array.filter(item => item <= limit);

    if( !(filteredArray.includes(limit)) && (array.pop() > limit) ) {      
      filteredArray.push(limit);
    }
    
    return filteredArray;
  }
}
