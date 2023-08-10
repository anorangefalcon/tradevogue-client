
import { FormControl,FormGroup } from '@angular/forms';



// PASSWORD VALIDATORS
export function passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    if(value=='') return null;
    let obj={uppercaseLetter:false,lowercaseLetter:false,digit:false,specialCharacter:false};
    
    // if (value.length < 8) {
      // obj.minLength=true;
      // return { 'password-fail': true,'min-length':true };
    // }

    if (!/[a-z]/.test(value)) {
      obj.lowercaseLetter=true;
      // return { 'password-fail': true ,'lowercase-letter':true};
    }

    if (!/[A-Z]/.test(value)) {
      obj.uppercaseLetter=true;
      // return { 'password-fail': true , 'capital-letter':true};
    }

    if (!/\d/.test(value)) {
      obj.digit=true;
      // return { 'password-fail': true,'dight-not-include':true };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      obj.specialCharacter=true;
      // return { 'password-fail': true ,'special-letter':true};
    }

    return obj; // Validation failed
  }




//   CONFIRM PASSSWORD VALIDATORS
  
export function matchPasswordValidator(control:any,signupForm:FormGroup) {
    // console.log("hello");
    const password = signupForm?.get('password')?.value;
    const confirmPassword = control.value;
  
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
   