import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(value: any[], arg: string): any[] | null {

    if(arg == '') return value;

    return value.filter((option: any)=>{
      return option.includes(arg) || option.toLowerCase().includes(arg);
    });
  }

}
