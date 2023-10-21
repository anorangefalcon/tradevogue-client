import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessThanOrEqual'
})
export class LessThanOrEqualPipe implements PipeTransform {

  transform(array: number[], limit: number): number[] {
    let limitCheck = false;
    return array.map((item: any) => {

      if ((item > limit)) {
        if (!limitCheck) {
          limitCheck = true;
          return limit;
        }
        return;
      }
      return item;

    });
  }

}
