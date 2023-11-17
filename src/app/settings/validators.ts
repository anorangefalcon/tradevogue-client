import { AbstractControl, FormControl,FormGroup } from '@angular/forms';

export function MobileNoValidator(control: AbstractControl): { [key: string]: boolean } | null{
    if(control.value=='') return null;
    var expr = /^[6-9][0-9]{9}$/;
    if (!expr.test(control.value)) {
        return {notvalid:true};
    }
  
    return null;
  }
