import { Component,Renderer2  } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { passwordStrengthValidator, matchPasswordValidator, usernameValidator } from '../validators'; // Adjust the path to the correct location
import { CookieService } from 'ngx-cookie-service';
import { UserDataService } from '../user-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

// import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupForm: FormGroup;
  users = [];
  script: any;
  isFormSubmitted: boolean = false;
  password: string = 'password';
  confirmPassword: string = 'password';
  showPassword: boolean = false;
  showPassword2: boolean = false;
  constructor(private fb: FormBuilder, private cookie: CookieService,private renderer: Renderer2, private userData: UserDataService, private backendURLs: UtilsModule, private fetchDataService: FetchDataService) {
    
    window.addEventListener('authCredential', (event: any) => {
      console.log('G-Event', event.detail);
    })




    this.userData.getData().subscribe((data: any) => {

      this.users = data;
      console.log(this.users);
    });


    this.signupForm = fb.group(


      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.email, Validators.required]),
        password: fb.control('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
        confirmPassword: fb.control('', [Validators.required, (control: any) => matchPasswordValidator(control, this.signupForm)])

      });


  }


  ngOnInit(): void {
       // new google auth
       this.script = this.renderer.createElement('script');
       this.script.src = 'https://accounts.google.com/gsi/client';
       this.script.async = true;
   
       this.renderer.appendChild(document.body, this.script);
   
    
  }





  // ON SUBMIT METHOD
  async onSubmit() {
    if (this.signupForm.invalid) return;
    try {
      const body = {
        name: { firstname: this.signupForm.get('firstname')?.value, lastname: this.signupForm.get('lastname')?.value },
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value
      }

      let data = await this.fetchDataService.httpPost(this.backendURLs.URLs.signupUrl, body);
    }

    catch (error) {

    }




  }


  toggle_password(el: any) {
    if (el == 'Password') {
      this.showPassword = !this.showPassword;
      this.password = this.showPassword ? 'text' : 'password';
    }
    else {
      this.showPassword2 = !this.showPassword2;
      this.confirmPassword = this.showPassword2 ? 'text' : 'password';
    }

  }

}

