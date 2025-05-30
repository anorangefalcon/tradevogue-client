import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialsService } from 'src/app/shared/services/custom-UI/socials.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.css']
})
export class SocialsComponent {
  socialsForm!: FormGroup;
  cachedFormGroup!: FormGroup;
  show: boolean = false;
  constructor(private fb: FormBuilder, private toastService: ToastService, 
    private socialsService: SocialsService) { }

  ngOnInit() {
    this.socialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      mobile: ['', Validators.pattern(/^\+[1-9]\d{1,14}$/)],
      facebook: [''],
      whatsapp: ['', Validators.pattern(/^\+[1-9]\d{1,14}$/)],
      instagramLink: [''],
      accountID: [''],
      accessToken: [''],
      desktopLogo: ['', Validators.required],
      mobileLogo: ['', Validators.required]
    });

    this.socialsService.getSocials().subscribe((data: any) => {
      
      this.socialsForm.setValue({
        email: data.email,
        mobile: data.mobile,
        address: data.address,
        facebook: data.facebook,
        whatsapp: data.whatsapp,
        instagramLink: data.instagram.link,
        accountID: data.instagram.accountID,
        accessToken: data.instagram.accessToken,
        desktopLogo: data.logos.desktop,
        mobileLogo: data.logos.mobile
      });

      this.cachedFormGroup=_.cloneDeep(this.socialsForm);
    });
    

    this.socialsForm.disable();
  }

  discardChanges(){
    this.socialsForm = this.cachedFormGroup;
  }
  

  onSubmit() {
    this.socialsService.setSocials(this.socialsForm?.value).subscribe((data: any) => {
      this.toastService.successToast({
        title: data.message
      });

      this.socialsForm.disable();
    });
  }

  ChangeHandler(event: boolean){
    this.show = event;
  }

}