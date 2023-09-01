import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { passwordStrengthValidator, matchPasswordValidator,usernameValidator } from '../validators'; // Adjust the path to the correct location
import { CookieService } from 'ngx-cookie-service';
import { UserDataService } from '../user-data.service';
// import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

signupForm:any;
users = [];
isFormSubmitted: boolean = false;
password:string='password';
password2:string='password';
showPassword:boolean=false;
showPassword2:boolean=false;
constructor(private fb:FormBuilder, private cookie : CookieService, private userData:UserDataService){

   this.userData.getData().subscribe((data:any)=>{

    this.users=data;
    console.log(this.users);
    });
  

  this.signupForm= fb.group(

    
    {
      username:fb.control('',[Validators.required,usernameValidator]),
      email:fb.control('',[Validators.email,Validators.required]),
      password:fb.control('',[Validators.required,Validators.minLength(8), passwordStrengthValidator]),
      confirmPassword: fb.control('',[Validators.required,(control: any) => matchPasswordValidator(control, this.signupForm)])
      
    });   
    
  
  }








  // ON SUBMIT METHOD
onSubmit() {
  this.isFormSubmitted = true;
  if (this.isFormSubmitted) {
    if (this.signupForm.valid) {
      const signupDetails = JSON.stringify(this.signupForm.value);
      const storedSignupDetails = this.cookie.get('signupDetails');
      let signupDetailsArray = [];
      if (storedSignupDetails) {
        signupDetailsArray = JSON.parse(storedSignupDetails);
      }
      signupDetailsArray.push(signupDetails);
      this.cookie.set('signupDetails', JSON.stringify(signupDetailsArray));
      console.log("signupDetails", signupDetails);
    }
  }
  console.log(this.signupForm);

  // Retrieve 
  const storedSignupDetails = this.cookie.get('signupDetails');
  if (storedSignupDetails) {
    const signupDetailsArray = JSON.parse(storedSignupDetails);
    for (const signupDetails of signupDetailsArray) {
      const parsedSignupDetails = JSON.parse(signupDetails);
      const username = parsedSignupDetails.username;
      console.log('Username:', username);
    }
  }
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

