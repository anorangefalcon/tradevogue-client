import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css']
})
export class HelpPageComponent {
  ticketData: string[] = [];
  contactForm: FormGroup;

  constructor(
    private fetchDataService: FetchDataService,
    private utils: UtilsModule,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cookie: CookieService
  ) {
      this.fetchDataService.HTTPGET(this.utils.URLs.getTicketStatus).subscribe((data: any)=> {
        this.ticketData = data[0].title;
      })
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      selectedTicket: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
        try {
          const body = {
            email: this.contactForm.get('email')?.value,
            status: 'open',
            message: this.contactForm.get('message')?.value,
          }
     this.fetchDataService.HTTPPOST(this.utils.URLs.ticketMail, body).subscribe((res => {
     }))
        }
        catch (error) {
        }

      this.fetchDataService.HTTPPOST(this.utils.URLs.saveTicket, this.contactForm.value)
        .subscribe((response: any) => {
        
        })
       

        this.fetchDataService.HTTPPOST(this.utils.URLs.webPushTokenDetail, {token: this.cookie.get('fcmToken'), email: this.contactForm.get('email')?.value}).subscribe((response: any) => {
          if (response) {

          }
        });
        

      this.contactForm.reset();

    } else {
    }
  }

  faqSubForm(field: string) {
    return this.contactForm.get('selectedTicket')?.get(field);
  }

  updateFormFields(field: string) {
    this.contactForm.get('selectedTicket')?.patchValue(field);
  }
}

