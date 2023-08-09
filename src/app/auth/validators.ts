
import { FormControl,FormGroup } from '@angular/forms';



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


//   CONFIRM PASSSWORD VALIDATORS
  
export function matchPasswordValidator(control:any,signupForm:FormGroup) {
    // console.log("hello");
    const password = signupForm?.get('password')?.value;
    const confirmPassword = control.value;
    // console.log("form is ",signupForm);
    // console.log("password is ",password);
    console.log("confirm password is ",confirmPassword);
    if (password === confirmPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }



}



// VALIDATOR FOR USERNAME

export function usernameValidator(control: FormControl): { [key: string]: boolean } | null {

  const value: string = control.value || '';

  if(value=='admin'){
    return null;
  }
  
  return {'invalidUser':true};
}
   