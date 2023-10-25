import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder
  ) {
    const url = this.utils.URLs.getTicketType;
    this.http.get(url).toPromise()
      .then((data: any) => {
        this.ticketData = data[0].title;
      })
      .catch(error => {
        console.error("Error loading data:", error);
      });

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
        let data = await this.fetchDataService.httpPost(this.utils.URLs.ticketMail, body)
        }
        catch (error) {
          console.log("Error in sending Subscribe Mail", error);
        }

      this.fetchDataService.httpPost(this.utils.URLs.addTicket, this.contactForm.value)
        .then((response: any) => {
          if (response) {
            console.log('Ticket added successfully.');
          } else {
            console.log('Error adding ticket.');
          }
        })
        .catch((error: any) => {
          console.log('Error adding ticket.', error);
        });

      this.contactForm.reset();

    } else {
      console.log('Form is not valid. Please check the fields.');
    }
  }
}
