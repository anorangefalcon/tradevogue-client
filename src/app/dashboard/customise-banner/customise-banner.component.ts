import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-customise-banner',
  templateUrl: './customise-banner.component.html',
  styleUrls: ['./customise-banner.component.css']
})
export class CustomiseBannerComponent {

  bannerForm!: FormGroup;
  alignment: string[] = ['Left', 'Right', 'Center'];
  previewImage: any;
  bannerData: any;
  preview: any;
  checked: boolean = false;
  editValue: any = '';

  constructor(private fb: FormBuilder,
    private bannerService: BannerService,
    private uploadService: ImageUploadService,
    private toastService: ToastService) {

    this.bannerForm = this.fb.group({
      backgroundImage: ['', Validators.required],
      title: '',
      subTitle: '',
      buttonText: '',
      buttonLink: ['', Validators.required],
      contentAlign: '',
      colors: this.fb.group({
        titleColor: '',
        subTitleColor: '',
        buttonColor: ''
      })
    })
  }

  ngOnInit() {
    this.bannerService.getBanners().subscribe((data: any) => {
      console.log(data, "banners data");
      this.bannerData = data;
    }
    )
  }

  isChecked() {
    if (this.checked == true) {
      this.bannerForm.get('title')?.disable()
      this.bannerForm.get('subTitle')?.disable()
      this.bannerForm.get('buttonText')?.disable()
      this.bannerForm.get('contentAlign')?.disable()
      this.bannerForm.get('colors')?.get('titleColor')?.disable()
      this.bannerForm.get('colors')?.get('subTitleColor')?.disable()
      this.bannerForm.get('colors')?.get('buttonColor')?.disable()
    }
    else {
      this.bannerForm.get('title')?.enable()
      this.bannerForm.get('subTitle')?.enable()
      this.bannerForm.get('buttonText')?.enable()
      this.bannerForm.get('contentAlign')?.enable()
      this.bannerForm.get('colors')?.get('titleColor')?.enable()
      this.bannerForm.get('colors')?.get('subTitleColor')?.enable()
      this.bannerForm.get('colors')?.get('buttonColor')?.enable()
    }

  }
  addBanner() {
    (this.bannerForm.get('banner') as FormArray).push(this.fb.group({
      backgroundImage: ['ok', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      buttonText: ['', Validators.required],
      buttonLink: ['', Validators.required],
      contentAlign: ['', Validators.required],
      colors: this.fb.group({
        titleColor: '',
        subTitleColor: '',
        buttonColor: ''
      })
    }))
  }

  getBanner() {
    return (this.bannerForm.get('banner') as FormArray).controls;
  }

  removeBanner(index: any) {
    (this.bannerForm.get('banner') as FormArray).removeAt(index);
  }

  onSave() {
    console.log(this.bannerForm.value, "valueeee");
    console.log(this.editValue, "edit value");
    
    if (!this.editValue) {
      this.bannerService.setBanners(this.bannerForm.value).subscribe((data: any) => {
        console.log(data, "subscribed data");
        const toast = {
          title: data.message
        }
        this.toastService.successToast(toast);
        this.bannerForm.reset()
        this.bannerForm.get('colors')?.reset();
        this.ngOnInit();
      })
    }
    else {
      const body = {
        id : this.editValue._id,
        data : this.bannerForm.value
      }
      console.log(body, "update body");
      
      this.bannerService.updateBanner(body).subscribe((res : any)=>{
        console.log(res, "update response");
        const toast = {
          title : res.message
        }
        this.toastService.successToast(toast)
        this.bannerForm.reset()
        this.bannerForm.get('colors')?.reset();
        this.ngOnInit();
      })
    }
  }



  getImages() {
    return this.bannerForm.get('backgroundImage')?.value;
  }

  bannerImageUpload(event: any) {
    console.log('formindex is --------> ');

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      console.log(url);
      this.bannerForm.get('backgroundImage')?.setValue(url[0]);
      console.log(this.bannerForm);
      this.getImagePreview();
    })
  }

  getImagePreview() {

    let value = this.bannerForm.get('backgroundImage')?.value;
    return value;
  }

  removeImage(index: any) {
    const bannerArray = this.bannerForm.get('banner') as FormArray;
    const bannerControl = bannerArray.at(index) as FormGroup;
    bannerControl.get('backgroundImage')?.reset('');
    // <FormArray>((this?.bannerForm?.get('banner'))?.get(String(index)))?.get('backgroundImage')?.reset()
  }

  delete(id: any) {
    const data = { id }
    this.bannerService.deleteBanner(data).subscribe((res: any) => {
      console.log(res, "del res");
      const toast = {
        title: res.message
      }
      this.toastService.warningToast(toast);
      this.ngOnInit()
    })
  }

  toggleBanner(id : any, event: any){
    let val =  (<HTMLInputElement>event.target).checked
    console.log(id, "id to be toggled", (<HTMLInputElement>event.target).checked, "event");
    const data = {
      id, active : val
    }
    console.log(data, "bodyyy");
    
    this.bannerService.toggleBanner(data).subscribe((res: any)=>{
      console.log(res);
      this.ngOnInit()
    })
  }

  edit(index: any) {
    const value = this.bannerData[index]
    console.log("baner value", value);
    console.log(value.title, "value.title");

    if (value.title) {
      this.bannerForm.patchValue({
        backgroundImage: value.backgroundImage,
        title: value.title,
        subTitle: value.subTitle,
        buttonText: value.buttonText,
        buttonLink: value.buttonLink,
        contentAlign: value.contentAlign,
        colors: {
          titleColor: value.colors.titleColor,
          subTitleColor: value.colors.subTitleColor,
          buttonColor: value.colors.buttonColor
        }
      })
    }
    else {
      this.bannerForm.patchValue({
        backgroundImage: value.backgroundImage,
        buttonLink: value.buttonLink
      })
    }
    this.editValue = value;
  }
  showLoading(i: number): boolean {
    return !this.getImagePreview();
  }
}
