import { Component, Renderer2 } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { passwordStrengthValidator, matchPasswordValidator, usernameValidator } from '../validators'; // Adjust the path to the correct location
import { CookieService } from 'ngx-cookie-service';
import { UserDataService } from '../user-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { Router } from '@angular/router';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupForm: FormGroup;
  script: any;
  password: string = 'password';
  showPassword: boolean = false;
  loading : boolean = false;

constructor(private fb: FormBuilder, private router: Router,private loginService:LoginCheckService, private cookies: CookieService, private renderer: Renderer2, private backendURLs: UtilsModule, private fetchDataService: FetchDataService) {
    // Google login
    window.addEventListener('signupEvent', async (event: any) => {
        const token = { credential: event.detail.credential }
        const body = { token };
        this.CreateUser(body);

    })

    this.signupForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.email, Validators.required]),
        password: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
       });

  }


  ngOnInit() {
    // new google auth
    this.script = this.renderer.createElement('script');
    this.script.src = 'https://accounts.google.com/gsi/client';
    this.script.async = true;
    this.renderer.appendChild(document.body, this.script);
  }

   CreateUser(body:any){
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.signupUrl, body).subscribe((data:any)=>{

      this.cookies.set('userToken', data.token)
      this.cookies.set('userName',data.firstName)
      this.router.navigate(['/']);
      this.loginService.LoginCheck.next(true);
      this.loading = false;
    })
  }

 
  // ON SUBMIT METHOD
  async onSubmit() {
    this.loading = true;
      const body = {
        name: { firstname: this.signupForm.get('firstname')?.value, lastname: this.signupForm.get('lastname')?.value },
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value
      }
      this.CreateUser(body);
    }
}

