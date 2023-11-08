import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {

  bannerForm!: FormGroup;
  alignment: string[] = ['Left', 'Right', 'Center'];
  previewImage: any;
  bannerData : any;
  preview: any;
  checked : boolean = false;

  constructor(private fb: FormBuilder, private bannerService: BannerService, private uploadService: ImageUploadService) {

    this.bannerForm = this.fb.group({
      banner: this.fb.array([
        this.fb.group({
          backgroundImage: ['', Validators.required],
          title: ['', Validators.required],
          subTitle: ['', Validators.required],
          buttonText: ['', Validators.required],
          buttonLink: ['', Validators.required],
          contentAlign: ['Left', Validators.required],
          colors: this.fb.group({
            titleColor: '',
            subTitleColor: '',
            buttonColor: ''
          })
        })
      ])
    })

  }


  getBanners(){
    this.bannerService.getBanners().subscribe((data: any) => {
      this.bannerData=data;
      const bannerFormArray = this.bannerData.map((banner: any) => this.fb.group({
        backgroundImage: [banner.backgroundImage, Validators.required],
        title: [banner.title, Validators.required],
        subTitle: [banner.subTitle, Validators.required],
        buttonText: [banner.buttonText, Validators.required],
        buttonLink: [banner.buttonLink, Validators.required],
        contentAlign: [banner.contentAlign, Validators.required],
        colors: this.fb.group({
          titleColor: banner.colors.titleColor,
          subTitleColor: banner.colors.subTitleColor,
          buttonColor: banner.colors.buttonColor
        })
      }));

      this.bannerForm.setControl('banner', this.fb.array(bannerFormArray));
      this.bannerForm.disable();
    });
  }

  ngOnInit(){
    // this.bannerService.getBanners().subscribe((data: any) => {
      // console.log(data, "banners data");
      // this.bannerData = data;
    this.getBanners();

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

  onUpdate() {
    console.log(this.bannerForm.value, "valueeee");
    this.bannerService.setBanners(this.bannerForm.value).subscribe((data) => {
      console.log(data, "subscribed data");
      this.bannerForm.disable();
    })
  }

  updateContentAlign(index: number, value: string) {
    // const bannerArray = this.bannerForm.get('banner') as FormArray;
    console.log(value, "njkn");

    // const bannerGroup = bannerArray.at(index) as FormGroup;
    // bannerGroup.get('contentAlign')?.setValue(value);
    this.bannerForm.get('banner')?.get(String(index))?.get('contentAlign')?.setValue(value);
  }

  

  getImages() {
    return this.bannerForm.get('backgroundImage')?.value;
  }

  bannerImageUpload(event: any, formIndex: any) {
    console.log('formindex is --------> ', formIndex);

    let file: any = (<HTMLInputElement>event.target)?.files![0];

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      console.log(url);
      this.bannerForm.get('banner')?.get(String(formIndex))?.get('backgroundImage')?.setValue(url[0]);
      console.log("hiii?");
      console.log(this.bannerForm);


      this.getImagePreview(formIndex);
    })
  }

  getImagePreview(index: any) {
    let value = <FormArray>((this?.bannerForm?.get('banner'))?.get(String(index)))?.get('backgroundImage')?.value;
    return value;
  }

  removeImage(index: any) {
    const bannerArray = this.bannerForm.get('banner') as FormArray;
    const bannerControl = bannerArray.at(index) as FormGroup;
    bannerControl.get('backgroundImage')?.reset('');
    // <FormArray>((this?.bannerForm?.get('banner'))?.get(String(index)))?.get('backgroundImage')?.reset()
  }
  showLoading(i: number): boolean {
    return !this.getImagePreview(i);
  }


}
