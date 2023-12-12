import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocialsService } from 'src/app/shared/services/custom-UI/socials.service';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {

  subscribeForm: FormGroup;
  socialsData!: any;

  constructor(fb: FormBuilder, private backendUrls: UtilsModule, private toastService: ToastService,
    private fetchDataService: FetchDataService, private socialsService: SocialsService) {
    this.subscribeForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    this.socialsService.getSocials().subscribe((res: any) => {
      this.socialsData = res;
    });
  }

  async onSubscribe() {

    if(this.subscribeForm.get('email')?.errors){
      this.toastService.errorToast({title: 'Invalid Email'});
      return;
    }

    const body = {
      email: this.subscribeForm.get('email')?.value
    }

    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.subscribeMail, body).subscribe((res: any) => {
      const toastData = {
        title: res.message,
      }
      this.toastService.successToast(toastData);
      this.subscribeForm?.reset();
    });
  }

}