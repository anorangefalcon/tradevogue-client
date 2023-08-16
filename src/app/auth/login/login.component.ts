import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordStrengthValidator, usernameValidator} from './validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm : FormGroup;

  passwordFieldType: string = 'password';
  showPassword: boolean = false;
  isFormSubmitted: boolean = false;

  constructor(private fb:FormBuilder){
    this.loginForm = fb.group(
      {
        username: fb.control('', [Validators.required, usernameValidator]), 
        password: fb.control('', [Validators.required, passwordStrengthValidator])
      }
    )
  }

  onLogin(){
    this.isFormSubmitted = !this.isFormSubmitted;
    console.log("hello");
    const data = this.loginForm;
    console.log(data);  
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
    console.log("pass");
    
}

}
