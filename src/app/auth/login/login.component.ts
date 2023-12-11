import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { Subscription } from 'rxjs';


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
  googleCallBackScript: any;
  loading: boolean = false;
  theme: Boolean = false;

  allSubscriptions: Subscription[] = [];

  constructor(
    fb: FormBuilder,
    private loginService: LoginCheckService,
    private backendUrls: UtilsModule,
    private fetchDataService: FetchDataService,
    private dialogService: DialogBoxService,
    private renderer: Renderer2) {

    (<HTMLMetaElement>document.getElementById('meta-description')).content = "Trade Vogue Login"

    this.loginForm = fb.group(
      {
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [Validators.required, Validators.minLength(6)])
      }
    )

    this.forgetPasswordForm = fb.group({
      passwordEmail: fb.control('', [Validators.required, Validators.email])
    })

    // // Google login
    // window.addEventListener('auth', (event: any) => {
    //   const token = { credential: event.detail.credential }
    //   const body = { token };
    //   this.LoginUser(body);
    // });
    window.addEventListener('auth', this.handleAuthEvent);
  }

  handleAuthEvent = (event: any) => {
    console.log('event fire of login');
    const token = { credential: event.detail.credential }
    const body = { token };
    this.LoginUser(body);
  }

  ngOnInit() {
    const scriptContent = `
      function googleAuth(res){
        console.log(res);
        const event = new CustomEvent('auth', { detail: res });
        window.dispatchEvent(event);
      }
    `;
    this.googleCallBackScript = this.renderer.createElement('script');
    this.googleCallBackScript.text = scriptContent;

    this.script = this.renderer.createElement('script');
    this.script.src = 'https://accounts.google.com/gsi/client';
    this.script.async = true;

    this.renderer.appendChild(document.body, this.googleCallBackScript);
    this.renderer.appendChild(document.body, this.script);

    this.allSubscriptions.push(
      this.fetchDataService.themeColor$.subscribe((color) => {
        this.theme = color;
      }));
  }


  LoginUser(body: any) {
    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.loginUrl, body).subscribe(
        (data: any) => {
          this.loginService.loginUser({ 'userToken': data.token, 'name': data.firstName });
        }
      ));

    this.loading = false;
  }

  onLogin() {
    this.loading = true;

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

    this.allSubscriptions.push(
      this.fetchDataService.HTTPPOST(this.backendUrls.URLs.forgetPasswordUrl, body).subscribe(
        (data: any) => {
          this.isactive = true;
          this.dialogService.infoDialogBox();
        }
      ));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  ngOnDestroy() {
    this.renderer.removeChild(document.body, this.googleCallBackScript);
    this.renderer.removeChild(document.body, this.script);
    window.removeEventListener('auth', this.handleAuthEvent);
    this.allSubscriptions.forEach((item: Subscription) => item?.unsubscribe());
  }
}