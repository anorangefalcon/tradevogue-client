import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UserServiceService } from 'src/app/shared/services/user-service.service';


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

  constructor(private fb: FormBuilder, private userService: UserServiceService, private cookies: CookieService, private router: Router, private userData: UserDataService, private route: ActivatedRoute, private backendUrls: UtilsModule, private fetchDataService: FetchDataService, private renderer: Renderer2) {
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
    window.addEventListener('loginEvent', async (event: any) => {
      const token = { credential: event.detail.credential }
      const body = { token };

      this.userService.loginUser(body).subscribe((data: any) => {
        this.cookies.set('userToken', data.token)
        this.cookies.set('userName', data.firstName)
        this.router.navigate(['/']);
      });


    })
  }

  ngOnInit() {
    this.script = this.renderer.createElement('script');
    this.script.src = 'https://accounts.google.com/gsi/client';
    this.script.async = true;

    this.renderer.appendChild(document.body, this.script);
  }

  async onLogin() {
    // try {

    const body = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
    //   const data: any = await this.fetchDataService.httpPost(this.backendUrls.URLs.loginUrl, body)

    //   this.fetchDataService.subject.next(data.firstName);
    //   this.cookies.set('userToken', data.token)
    //   this.cookies.set('userName', data.firstName)
    //   // this.
    //   this.router.navigate(['/']);

    // }
    // catch (error) {
    //   console.log("Error in Logging In: ", error);
    // }

    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.loginUrl, body).subscribe(
      (data: any) => {
        this.fetchDataService.subject.next(data.firstName);
        this.cookies.set('userToken', data.token)
        this.cookies.set('userName', data.firstName)
        this.router.navigate(['/']);
      }
    )

      // this.fetchDataService.subject.next(data.firstName);
      // this.cookies.set('userToken', data.token)
      // this.cookies.set('userName', data.firstName)
      // let response=await this.userService.SubscribingValue('GoToPayment');
      // if(response){
      //   this.router.navigate(['/cart/billing']);
      //   return;
      // }
      // this.router.navigate(['/']);

  }

  async onResetPassword() {
    try {
      const body = {
        email: this.forgetPasswordForm.get('passwordEmail')?.value
      }
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.forgetPasswordUrl, body).subscribe(
        (data: any) => {
          console.log(data, "forget password data");
          this.isactive = true;
        }
      )
      // const data = await this.fetchDataService.httpPost(this.backendUrls.URLs.forgetPasswordUrl, body);
      // console.log(data, "forget password data");
      // this.isactive = true;

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
