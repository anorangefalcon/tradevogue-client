import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordStrengthValidator, usernameValidator} from './validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm : any;
  constructor(private fb:FormBuilder){
    this.loginForm = fb.group(
      {
        username: fb.control('', [Validators.required, usernameValidator]), 
        password: fb.control('', [Validators.required, passwordStrengthValidator])
      }
    )
  }

  onLogin(){
    console.log("hello");
    const data = this.loginForm;
    console.log(data);
    
  }

}
