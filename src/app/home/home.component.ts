import { Component } from '@angular/core';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  subscribeForm: FormGroup;

  constructor(private fb: FormBuilder, private backendUrls: UtilsModule, private fetchDataService: FetchDataService) {
    this.subscribeForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
    })
  }
  onSubscribe() {
    try {
      const body = {
        email: this.subscribeForm.get('email')?.value
      }
    }
    catch (error) {
      console.log("Error in sending Subscribe Mail", error);
    }
  }
}
