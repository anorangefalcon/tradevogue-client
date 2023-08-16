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
isFormSubmitted: boolean = false;
password:string='password';
password2:string='password';
showPassword:boolean=false;
showPassword2:boolean=false;
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
    this.isFormSubmitted = true;

    console.log(this.signupForm);
  }


  toggle_password(el:any){
    if(el==1){
      this.showPassword=!this.showPassword;
      this.password=this.showPassword ? 'text':'password';
    }
   else{
    this.showPassword2=!this.showPassword2;
    this.password2=this.showPassword2 ? 'text':'password';
   }

  }

}

