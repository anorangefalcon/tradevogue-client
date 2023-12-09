import { FormControl,FormGroup } from '@angular/forms';



// PASSWORD VALIDATORS
export function passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';

    console.log("min")
    if(value=='') return null;
    
    let errors :any={}; 
  


    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = true;  
      }

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
     
    }

    if (!/\d/.test(value)) {
      errors['digit'] = true;
      
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['specialCharacter'] = true;
      
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }




// CONFIRM PASSSWORD VALIDATORS  
export function matchPasswordValidator(control:any,signupForm:FormGroup) {
    
    const password = signupForm?.get('password')?.value;
    const confirmPassword = control.value;
  if(password=='') return null;

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


// VALIDATOR FOR MOBILE NO
export  function PhoneNumberValidator(control: FormControl): any{
  let expression:any=/^\+?[1-9][0-9]{7,14}$/;
  if( expression.test(control.value)) return null;
  return {invalidPhoneNo:true};
}
