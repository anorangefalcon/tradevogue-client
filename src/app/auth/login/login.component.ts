import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordStrengthValidator, usernameValidator} from './validators';
import { CookieService } from 'ngx-cookie-service';
import { Router , ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';

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

  constructor(private fb:FormBuilder , private cookies :  CookieService , private router : Router , private userData : UserDataService, private route: ActivatedRoute){
    this.loginForm = fb.group(
      {
        username: fb.control('', [Validators.required, usernameValidator]), 
        password: fb.control('', [Validators.required, passwordStrengthValidator])
      }
    )
  }


onLogin() {
  this.isFormSubmitted = !this.isFormSubmitted;
  const username = this.loginForm.get('username')?.value;
  const password = this.loginForm.get('password')?.value;
  console.log(this.loginForm);
  
  
  this.userData.login(username, password).subscribe((isLoggedIn: boolean) => {
    if (isLoggedIn) {
      const user = { username: username, password: password };
      this.cookies.set("loginDetails", JSON.stringify(user));

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/']);
      }
    }
  });
}




  // onLogin(){
    // this.isFormSubmitted = !this.isFormSubmitted;
  //   if(this.isFormSubmitted){
  //      if(this.loginForm.valid) {
  //           this.cookies.set("loginDetails",JSON.stringify(this.loginForm.value));
  //           console.log("loginDetails",this.loginForm.value);
  //           this.router.navigate(['/']);
  //      }
  //   }
  //   console.log("hello");
  //   const data = this.loginForm;
  //   console.log(data);
  // }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';

    
}

}
