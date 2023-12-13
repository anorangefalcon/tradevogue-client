import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipes',
})
export class PipesPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    const search_text = searchText;
    if (searchText == '') return value;

    value = value.filter((e) => {
      return e.toLowerCase().includes(searchText);
    });

    return value;
  }
}
