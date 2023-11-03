import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';

@Component({
  selector: 'app-custom-banner',
  templateUrl: './custom-banner.component.html',
  styleUrls: ['./custom-banner.component.css']
})
export class CustomBannerComponent {

  bannerForm! : FormGroup;

  constructor (private fb: FormBuilder, private bannerService : BannerService) {

    this.bannerForm = this.fb.group({
      banner : this.fb.array([
        this.fb.group({
          backgroundImage : ['', Validators.required],
          title : ['', Validators.required],
          description : ['', Validators.required],
          button : ['', Validators.required],
          buttonLink : ['', Validators.required],
        })
      ])
    })

  }

  addBanner(){
    (this.bannerForm.get('banner') as FormArray).push(this.fb.group({
      backgroundImage : ['', Validators.required],
      title : ['', Validators.required],
      description : ['', Validators.required],
      button : ['', Validators.required],
      buttonLink : ['', Validators.required],
    }))
  }

  getBanner() {
    return (this.bannerForm.get('banner') as FormArray).controls;
  }

  onUpdate() {
    console.log(this.bannerForm.value);
    this.bannerService.setBanners(this.bannerForm.value).subscribe((data)=>{
      console.log(data, "subscribed data");
      
    })

  }

  bannerImageUpload(event : any) {
    
  }

}
