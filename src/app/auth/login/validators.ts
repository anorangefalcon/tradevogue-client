import { FormControl } from '@angular/forms';



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

    return null; // Validation passed
  }
export function usernameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';

    if (value == "admin"){
        return null;
    }
    return {'invalidUsername': true}
}
