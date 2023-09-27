import { FormControl,FormGroup } from '@angular/forms';



// PASSWORD VALIDATORS
export function passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
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