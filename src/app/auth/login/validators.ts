import { FormControl } from '@angular/forms';
import { UserDataService } from '../user-data.service';



// PASSWORD VALIDATORS
export function passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';

    if (value.length < 8) {
      return { 'password-fail': true };
    }

    if (!/[a-z]/.test(value)) {
      return { 'password-fail': true };
    }

    if (!/[A-Z]/.test(value)) {
      return { 'password-fail': true };
    }

    if (!/\d/.test(value)) {
      return { 'password-fail': true };
    }

    if(value == 'Pass@123.'){
      return null;
    }

    return { 'password-fail': true };
  }
  
export function usernameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';

    if (value == "admin"){
        return null;
    }
    
    return {'invalidUsername': true}
}
