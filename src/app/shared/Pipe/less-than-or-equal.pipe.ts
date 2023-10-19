import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessThanOrEqual'
})
export class LessThanOrEqualPipe implements PipeTransform {

  transform(array: number[], limit: number): number[] {
    return array.filter(item => item <= limit);
  }

}
