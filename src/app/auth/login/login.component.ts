import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';



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

  constructor(private fb: FormBuilder,private loginService:LoginCheckService, private wishlistService:WishlistService, private cookies: CookieService, private router: Router, private userData: UserDataService, private route: ActivatedRoute, private backendUrls: UtilsModule, private fetchDataService: FetchDataService, private renderer: Renderer2) {
    this.loginForm = fb.group(
      {
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required, Validators.minLength(6)])
      }
    )

    this.forgetPasswordForm = fb.group({
      passwordEmail: fb.control('', [Validators.required, Validators.email])
    })

    // Google login
    window.addEventListener('loginEvent',(event:any)=>{
      const token = { credential: event.detail.credential }
        const body = { token };
      this.LoginUser(body);
    } );
  }
  
  ngOnInit() {
    this.script = this.renderer.createElement('script');
    this.script.src = 'https://accounts.google.com/gsi/client';
    this.script.async = true;

    this.renderer.appendChild(document.body, this.script);
  }


  LoginUser(body:any){ 
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.loginUrl, body).subscribe(
      (data: any) => {
        this.fetchDataService.subject.next(data.firstName);
        this.cookies.set('userToken', data.token)
        this.cookies.set('userName', data.firstName)
        this.router.navigate(['/']);
        this.loginService.LoginCheck.next(true);
      }
    )
  }

  async onLogin() {
    console.log("he");
    
    const body = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.LoginUser(body);
  }

  async onResetPassword() {
      const body = {
        email: this.forgetPasswordForm.get('passwordEmail')?.value
      }
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.forgetPasswordUrl, body).subscribe(
        (data: any) => {
          console.log(data, "forget password data");
          this.isactive = true;
        }
      )
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }
}
