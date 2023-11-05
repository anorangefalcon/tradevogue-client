import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { passwordStrengthValidator } from '../validators';
import { Router } from '@angular/router';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

  resetPasswordForm: FormGroup;
  passwordFieldType: string = 'password';
  passwordFieldType2: string = 'password';
  showPassword: boolean = false;
  showPassword2: boolean = false;
  token: string = "";

  constructor(private fb: FormBuilder, private router: Router, private backendUrls: UtilsModule, private fetchDataService: FetchDataService, private toastservice: ToastService) {
    this.resetPasswordForm = fb.group({
      password: fb.control('', [Validators.required, passwordStrengthValidator]),
      confirmPassword: fb.control('', [Validators.required, passwordStrengthValidator])
    },
      {
        validators: this.passwordMatch
      }
    )
  }
  async ngOnInit() {
    this.token = this.router.url.split('/')[3];
    // try {


    //   const body = {
    //     tokenData: this.token
    //   }
    //   // const data = await this.fetchDataService.httpPost(this.backendUrls.URLs.updatePasswordUrl, body);

    // } catch (error) {
    //   this.router.navigate(['/']);
    // }


  }
  passwordMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmpassword = control.get('confirmPassword')?.value

    if (password === confirmpassword) {
      return null;
    } else {
      return { passwordsNotMatch: true };
    }
  }
  async onReset() {
    // console.log(this.resetPasswordForm.value)

    // try {
    const body = {
      password: this.resetPasswordForm.get('password')?.value,
      tokenData: this.token
    }

    // const data: any = await this.fetchDataService.httpPost(this.backendUrls.URLs.updatePasswordUrl, body);

    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.updatePasswordUrl, body).subscribe(
      (data: any) => {
        console.log(data, "update data");
        const toastData = {
          title: data.message,
        }
        this.toastservice.successToast(toastData)
        setTimeout(() => {
          this.router.navigate(['/auth/login'])
        }, 5000);
      })

  }
}