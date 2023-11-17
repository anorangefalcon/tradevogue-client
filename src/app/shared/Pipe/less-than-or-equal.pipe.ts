import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessThanOrEqual'
})
export class LessThanOrEqualPipe implements PipeTransform {

  transform(array: any[], limit: number): number[] { 

    let filteredArray = array.filter(item => item <= limit);
    return filteredArray;
    
  }
}
