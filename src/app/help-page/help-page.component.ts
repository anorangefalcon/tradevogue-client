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
      console.log('Submitted Data:', this.contactForm.value);
        try {
          const body = {
            email: this.contactForm.get('email')?.value,
            status: 'open',
            message: this.contactForm.get('message')?.value,
          }
     this.fetchDataService.HTTPPOST(this.utils.URLs.ticketMail, body).subscribe((res => {
      console.log(res , "response send ")
     }))
        }
        catch (error) {
          console.log("Error in sending Subscribe Mail", error);
        }

      this.fetchDataService.HTTPPOST(this.utils.URLs.saveTicket, this.contactForm.value)
        .subscribe((response: any) => {
          if (response) {
            console.log('Ticket added successfullsy.');
          } else {
            console.log('Error adding ticket.');
          }
        })
       

        this.fetchDataService.HTTPPOST(this.utils.URLs.webPushTokenDetail, {token: this.cookie.get('fcmToken'), email: this.contactForm.get('email')?.value}).subscribe((response: any) => {
          if (response) {
            console.log('Token added successfully.');
          }
        });
        

      this.contactForm.reset();

    } else {
      console.log('Form is not valid. Please check the fields.');
    }
  }

  faqSubForm(field: string) {
    return this.contactForm.get('selectedTicket')?.get(field);
  }

  updateFormFields(field: string) {
    this.contactForm.get('selectedTicket')?.patchValue(field);
  }
}

