import { Component, Renderer2 } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { passwordStrengthValidator } from '../validators'; // Adjust the path to the correct location
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupForm: FormGroup;
  script: any;
  googleCallBackScript: any;

  password: string = 'password';
  showPassword: boolean = false;
  loading: boolean = false;
  theme: Boolean = false;
  dataSubscription: Subscription[] = [];

  constructor(fb: FormBuilder, private loginService: LoginCheckService,
     private renderer: Renderer2, private backendURLs: UtilsModule, private fetchDataService: FetchDataService) {
    // Google login
    // window.addEventListener('auth', async (event: any) => {
    //   console.log('event fired');
      
    //   const token = { credential: event.detail.credential }
    //   const body = { token };
    //   this.CreateUser(body);
    // })

    window.addEventListener('auth', this.handleAuthEvent);
    this.signupForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.email, Validators.required]),
        password: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
      });

  }





handleAuthEvent =  (event: any) => {
  console.log('event fire of signup');
  
  const token = { credential: event.detail.credential }
  const body = { token };
  this.CreateUser(body);
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
    this.dataSubscription.push(
      this.fetchDataService.themeColor$.subscribe((color)=>{
        this.theme = color;
      }));
  }

  CreateUser(body:Object) {
    this.dataSubscription.push(
       this.fetchDataService.HTTPPOST(this.backendURLs.URLs.signupUrl, body).subscribe({
      next: (data: any) => {
        this.loginService.loginUser({ 'userToken': data.token, 'name': data.firstName });
        this.loading = false;
      }, error: () => {
        this.loading = false;
      }
    }));
  }


  // ON SUBMIT METHOD
  onSubmit() {
    this.loading = true;
    const body = {
      name: { firstname: this.signupForm.get('firstname')?.value, lastname: this.signupForm.get('lastname')?.value },
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value
    }
    this.CreateUser(body);
  }

  ngOnDestroy() {
    this.renderer.removeChild(document.body, this.googleCallBackScript);
    this.renderer.removeChild(document.body, this.script);
    window.removeEventListener('auth', this.handleAuthEvent);
    this.dataSubscription.forEach((item: Subscription)=> item?.unsubscribe());
  }
}