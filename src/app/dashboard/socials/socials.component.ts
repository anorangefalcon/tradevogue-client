import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.css']
})
export class SocialsComponent {
  socialsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.socialsForm = this.fb.group({
      facebookLink: '',
      whatsappNumber: ['', Validators.pattern(/^\+[1-9]\d{1,14}$/)],
      instagramLink: '',
      accountID: '',
      accessToken: ''
    });
  }

  onSubmit() {

    console.log(this.socialsForm?.value);
  }
}

// Facebook credentials::
// Email: business.tradevogue@gmail.com
// Password:
// Trade@2023.
