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
  showForm : boolean = false;

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
    if (!this.editValue) {
      this.bannerService.setBanners(this.bannerForm.value).subscribe((data: any) => {
  
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
      
      this.bannerService.updateBanner(body).subscribe((res : any)=>{
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
   

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.bannerForm.get('backgroundImage')?.setValue(url[0]);
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
      const toast = {
        title: res.message
      }
      this.toastService.warningToast(toast);
      this.ngOnInit()
    })
  }

  toggleBanner(id : any, event: any){
    let val =  (<HTMLInputElement>event.target).checked
    const data = {
      id, active : val
    }
    
    this.bannerService.toggleBanner(data).subscribe((res: any)=>{
      this.ngOnInit()
    })
  }

  edit(index: any) {
    const value = this.bannerData[index]
  
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
