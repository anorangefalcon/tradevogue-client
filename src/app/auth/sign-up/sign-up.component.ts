import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { passwordStrengthValidator, matchPasswordValidator,usernameValidator } from '../validators'; // Adjust the path to the correct location



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {




signupForm:any;

constructor(private fb:FormBuilder){




  this.signupForm= fb.group(

    
    {
      username:fb.control('',[Validators.required,usernameValidator]),
      email:fb.control('',[Validators.email,Validators.required]),
      password:fb.control('',[Validators.required,Validators.minLength(8), passwordStrengthValidator]),
      confirmPassword: fb.control('',[Validators.required,(control: any) => matchPasswordValidator(control, this.signupForm)])
      
    });   
    
  
  }








  // ON SUBMIT METHOD
  onSubmit(){
    console.log(this.signupForm);
  }

}

