import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialsService } from 'src/app/shared/services/custom-UI/socials.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.css']
})
export class SocialsComponent {
  socialsForm!: FormGroup;
  show: boolean = false;
  constructor(private fb: FormBuilder, private toastService: ToastService, 
    private socialsService: SocialsService, private uploadService: ImageUploadService) { }

  ngOnInit() {
    this.socialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      address: '',
      mobile: ['', Validators.pattern(/^\+[1-9]\d{1,14}$/)],
      facebook: '',
      whatsapp: ['', Validators.pattern(/^\+[1-9]\d{1,14}$/)],
      instagramLink: '',
      accountID: '',
      accessToken: '',

      // desktopLogo: ['', Validators.required],
      // mobileLogo: ['', Validators.required]
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
        // desktopLogo: data.logos.desktop,
        // mobileLogo: data.logos.mobile
      });
      // console.log(this.socialsForm.value);
      
    });
    
    this.socialsForm.disable();
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

  // bannerImageUpload(event: any, logoType: any) {
  //   let file: any = (<HTMLInputElement>event.target)?.files![0];

  //   this.uploadService.fileupload([{ file: file }]).then((url: any) => {
  //     this.socialsForm.get(logoType)?.setValue(url[0]);
  //     this.getImagePreview(logoType);
  //   });
  // }


  // getImagePreview(logoType: any) {
  //   return this.socialsForm.get(logoType)?.value;
  // }
  
}