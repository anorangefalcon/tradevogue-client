import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginForm: FormGroup;
  forgetPasswordForm: FormGroup;
  passwordFieldType: string = 'password';
  showPassword: boolean = false;
  showPasswordForm: boolean = false;
  isactive: boolean = false;
  script: any;

  constructor(private fb: FormBuilder, private cookies: CookieService, private router: Router, private userData: UserDataService, private route: ActivatedRoute, private backendUrls: UtilsModule, private fetchDataService: FetchDataService, private renderer: Renderer2) {
    this.loginForm = fb.group(
      {
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required, passwordStrengthValidator])
      }
    )

    this.forgetPasswordForm = fb.group({
      passwordEmail: fb.control('', [Validators.required, Validators.email])
    })
  
    
    // Google login
    window.addEventListener('loginEvent', async (event: any) => {
      try {
        const token = { credential: event.detail.credential }
        const body = { token };
        console.log("loginnnnn------------------");
        
        let data: any = await this.fetchDataService.httpPost(this.backendUrls.URLs.loginUrl, body);
        console.log(data,"dataaaa");
        
        this.cookies.set('userToken', data.token)
        this.cookies.set('userName',data.firstName)
       
        this.router.navigate(['/']);

      } catch (error) {

      }

    })
  }

  ngOnInit() {
    this.script = this.renderer.createElement('script');
    this.script.src = 'https://accounts.google.com/gsi/client';
    this.script.async = true;

    this.renderer.appendChild(document.body, this.script);
  }

  async onLogin() {
    try {
      console.log("loginnnnn itself------------------");
        
      const body = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }



      const data:any = await this.fetchDataService.httpPost(this.backendUrls.URLs.loginUrl, body)
      
      this.fetchDataService.subject.next(data.firstName);  
      this.cookies.set('userToken', data.token)
      this.cookies.set('userName',data.firstName)
      this.router.navigate(['/']);

    }
    catch (error) {
      console.log("Error in Logging In: ", error);
    }
  }

  async onResetPassword() {
    try {
      const body = {
        email: this.forgetPasswordForm.get('passwordEmail')?.value
      }
      const data = await this.fetchDataService.httpPost(this.backendUrls.URLs.forgetPasswordUrl, body);
      console.log(data, "forget password data");
      this.isactive = true;

    }
    catch (error) {
      console.log("Error in Reset Password: ", error);
      
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }
}
