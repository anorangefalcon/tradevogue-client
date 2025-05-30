import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransformOptions } from 'filestack-js';
import { Subscription } from 'rxjs';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { DialogBoxService } from 'src/app/shared/services/dialog-box.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-customise-banner',
  templateUrl: './customise-banner.component.html',
  styleUrls: ['./customise-banner.component.css']
})
export class CustomiseBannerComponent {

  bannerForm!: FormGroup;
  allSubscriptions: Subscription[] = [];
  ParenClosed: boolean = false;
  alignment: string[] = ['Left', 'Right', 'Center'];
  previewImage: any;
  bannerData: any = [];
  preview: any;
  checked: boolean = false;
  checked2: boolean = false;
  editValue: any = '';
  showForm: boolean = false;
  deleteId: any;
  checkbox: boolean = false;
  popUpDirection: any = 'right';
  showingPopUp: boolean = false;
  ParentClosed: boolean = false;
  
  transformOptions: TransformOptions = {
    resize: {
      height: 1000
    },
    pjpg: {
      quality: 60,
      metadata: true,
    }

  };

  constructor(private fb: FormBuilder,
    private bannerService: BannerService,
    private uploadService: ImageUploadService,
    private dialogService: DialogBoxService,
    private toastService: ToastService) {

    this.bannerForm = this.fb.group({
      backgroundImage: ['',
        Validators.required
      ],
      title: '',
      subTitle: '',
      buttonText: '',
      buttonLink: ['',
        Validators.required
      ],
      contentAlign: '',
      colors: this.fb.group({
        titleColor: '',
        subTitleColor: '',
        buttonColor: ''
      })
    });


    this.allSubscriptions.push(
      dialogService.responseEmitter.subscribe({
        next: (res: any) => {
          if (res) {
            this.bannerService.deleteBanner({ id: this.deleteId }).subscribe((res: any) => {
              const toast = {
                title: res.message
              }
              this.toastService.successToast(toast);
              this.ngOnInit()
            });
          }
        }
      }));

  }

  ngOnInit() {
    console.log(this.checkbox, "before");
    this.allSubscriptions.push(
      this.bannerService.getBanners().subscribe((data: any) => {
        this.bannerData = data;
      }
      ))
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
  }


  FormValues: any = {};

  isChecked() {
    let val = this.checkbox;
    let values: any = {};

    if (this.editValue && val) {

      values['title'] = this.bannerForm.get('title')?.value;
      values['subTitle'] = this.bannerForm.get('subTitle')?.value;
      values['buttonText'] = this.bannerForm.get('buttonText')?.value;
      values['contentAlign'] = this.bannerForm.get('contentAlign')?.value;
      let color = {
        titleColor: this.bannerForm.get('colors')?.get('titleColor')?.value,
        subTitleColor: this.bannerForm.get('colors')?.get('subTitleColor')?.value,
        buttonColor: this.bannerForm.get('colors')?.get('buttonColor')?.value,
      }

      values.color = color;
      this.FormValues = values;

      this.bannerForm.get('title')?.reset()
      this.bannerForm.get('subTitle')?.reset()
      this.bannerForm.get('buttonText')?.reset()
      this.bannerForm.get('contentAlign')?.reset()
      this.bannerForm.get('colors')?.get('titleColor')?.reset()
      this.bannerForm.get('colors')?.get('subTitleColor')?.reset()
      this.bannerForm.get('colors')?.get('buttonColor')?.reset()
      this.bannerForm.get('buttonText')?.disable()
      this.bannerForm.get('contentAlign')?.disable();
      this.bannerForm.get('colors')?.get('titleColor')?.disable()
      this.bannerForm.get('colors')?.get('subTitleColor')?.disable()
      this.bannerForm.get('colors')?.get('buttonColor')?.disable()
    }

    if (val) {
      this.bannerForm.get('title')?.disable()
      this.bannerForm.get('subTitle')?.disable()
      this.bannerForm.get('buttonText')?.disable()
      this.bannerForm.get('contentAlign')?.disable();
      this.bannerForm.get('colors')?.get('titleColor')?.disable()
      this.bannerForm.get('colors')?.get('subTitleColor')?.disable()
      this.bannerForm.get('colors')?.get('buttonColor')?.disable()
    }
    else {
      this.bannerForm.patchValue(this.FormValues);
      this.bannerForm.get('colors')?.patchValue(this.FormValues.color);
      this.bannerForm.get('title')?.enable()
      this.bannerForm.get('subTitle')?.enable()
      this.bannerForm.get('buttonText')?.enable()
      this.bannerForm.get('contentAlign')?.enable()
      this.bannerForm.get('colors')?.get('titleColor')?.enable()
      this.bannerForm.get('colors')?.get('subTitleColor')?.enable()
      this.bannerForm.get('colors')?.get('buttonColor')?.enable()
    }
  }

  saveData: boolean = false;
  onSave() {
    this.saveData = true;
    this.showForm=false;

    if (!this.editValue) {
      this.allSubscriptions.push(
        this.bannerService.setBanners(this.bannerForm.value).subscribe((data: any) => {
          const toast = {
            title: data.message
          }
          this.toastService.successToast(toast);
          this.bannerForm.reset()
          this.bannerForm.get('colors')?.reset();
          this.ngOnInit();
          this.saveData = false;
        }))
    }
    else {
      const body = {
        id: this.editValue._id,
        data: this.bannerForm.value
      }

      this.allSubscriptions.push(
        this.bannerService.updateBanner(body).subscribe((res: any) => {
          const toast = {
            title: res.message
          }
          this.toastService.successToast(toast)
          this.bannerForm.reset()
          this.bannerForm.get('colors')?.reset();
          this.ngOnInit();
          this.saveData = false;
        }))
    }

    this.showingPopUp = false;
  }

  uploading: boolean = false;
  bannerImageUpload(event: any) {

    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.uploading = true;

    this.uploadService.fileupload([{ file: file }]).then((url: any) => {
      this.bannerForm.get('backgroundImage')?.setValue(url[0]);
      this.getImagePreview();
      this.uploading = false; 
    })
  }

  getImagePreview() {

    let value = this.bannerForm.get('backgroundImage')?.value;
    return value;
  }

  onImageRemove() {

    if(!(this.bannerForm.get('backgroundImage')?.value).includes('https://cdn.filestackcontent.com')){
          this.bannerForm.get('backgroundImage')?.reset();
          return;
    }
    this.uploadService.delete(this.bannerForm.get('backgroundImage')?.value).then(()=>{
      this.toastService.successToast({title: "Images Removed"});
      this.bannerForm.get('backgroundImage')?.reset();
    });
  }

  delete(id: any) {
    this.deleteId = id;
    let template: any = {
      title: 'Proceed with Deletion?',
      subtitle: 'The banner will be permanently deleted, and recovery will not be possible. Are you sure you want to proceed?',
      type: 'confirmation',
      confirmationText: 'Yes, Delete it',
      cancelText: 'No, Keep it',
    };
    this.dialogService.confirmationDialogBox(template);
  }

  toggleBanner(id: any, event: any) {
    let val = (<HTMLInputElement>event.target).checked
    const data = {
      id, active: val
    }
    this.allSubscriptions.push(
      this.bannerService.toggleBanner(data).subscribe((res: any) => {
        this.ngOnInit()
      }))
  }

  edit(index: any) {
    const value = this.bannerData[index];
    this.bannerForm.reset();

    if (value.title) {
      this.checkbox = false;

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
      this.checkbox = true;
      this.bannerForm.patchValue({
        backgroundImage: value.backgroundImage,
        buttonLink: value.buttonLink
      });
    }
    this.isChecked();
    this.editValue = value;
  }

  showLoading(i: number): boolean {
    return !this.getImagePreview();
  }

  PopUpChangeHanlder(event: boolean) {
    this.showingPopUp = event;
  }
  ParentClosedHandler(event: any) {
    this.ParentClosed = event;
  }
}
