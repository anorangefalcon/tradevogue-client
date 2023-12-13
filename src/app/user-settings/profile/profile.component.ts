import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

import { LoginCheckService } from 'src/app/shared/services/login-check.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  ProfileForm: FormGroup;
  ProfileDisabled: boolean = true;
  ProfileFormCopy:any
  constructor(  private fb: FormBuilder, 
    private  fetchDataService: FetchDataService, 
     private backendURLs : UtilsModule,
     private userService: LoginCheckService){
    this.ProfileForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control(''),
        email: fb.control('',),
        mobile: fb.control('', [Validators.pattern('^[6-9]\\d{9}$')]),
        gender: fb.control('',),
        dob: fb.control(''),
      });

  }

  ngOnInit(){
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getDetails).subscribe((data: any) => {
      data.firstname = data.name.firstname;
      data.lastname = data.name.lastname;
      data.gender = data.info.gender;
      if (data.info.dob) {
        data.dob = data.info.dob.split('T')[0];
      }
      this.ProfileFormCopy=JSON.parse(JSON.stringify(data));
      this.ProfileForm.patchValue(data);
    });
    this.ProfileForm.disable()
  }
  
  DisableEnableForm(check: boolean, cancelClicked:boolean=false) {
    if (check) {
      if(cancelClicked) this.ProfileForm.patchValue(this.ProfileFormCopy);
      this.ProfileForm.disable(); 
      this.ProfileDisabled = true;
    }
    else { 
      this.ProfileForm.enable(); 
      this.ProfileDisabled = false;
    }
  }
  async saveDetails() {
    let body = {
      name: { firstname: this.ProfileForm.get('firstname')?.value, lastname: this.ProfileForm.get('lastname')?.value },
      mobile: this.ProfileForm.get('mobile')?.value,
      "info.gender": this.ProfileForm.get('gender')?.value,
      "info.dob": new Date(this.ProfileForm.get('dob')?.value)
    }
    this.fetchDataService.HTTPPATCH(this.backendURLs.URLs.updateDetails, body).subscribe((data) => {
      this.DisableEnableForm(true);
      this.userService.updateDetails(body);
    });
  }
}
