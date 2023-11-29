import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  Edit: Boolean = false;
  AboutPageForm!: FormGroup
  AboutPageValues: any
  AboutForm:FormGroup
  constructor(
    private fb: FormBuilder, 
    private imageuploadService: ImageUploadService, 
    private backendURLs: UtilsModule, 
    private fetchDataService: FetchDataService, 
    private toastService: ToastService) {

    this.AboutForm = this.fb.group({
      BasicInfo: this.fb.group({
        content: this.fb.group({
          name: ['', Validators.required],
          tagline: ['', Validators.required],
          description: ['', Validators.required],
          foundedYear: ['', [Validators.required, this.FoundedYearValidator]],
          growthDescription: ['', Validators.required],
          Feature1: this.fb.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
          }),

          Feature2: this.fb.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
          }),

        }),
        StoreImages: this.fb.control(['',[ Validators.required]]),
      }),
      TeamMembers: this.fb.array([
      ]),
    })


    this.AboutPageForm=_.cloneDeep(this.AboutForm);

    this.FetchDetails();
    // this.FormDisableEnable();
  } 


  FetchDetails(){
    this.AboutPageForm=_.cloneDeep(this.AboutForm);
    this.fetchDataService.HTTPGET((this.backendURLs.URLs.getAboutDetails)).subscribe((data: any) => {
      data.TeamMembers.forEach((el:any)=>{
        this.AddTeamMember();
      })
      this.AboutPageForm.patchValue(data);
      this.AboutPageValues = JSON.parse(JSON.stringify(data));
      this.FormDisableEnable();
    })
  }



  FoundedYearValidator(control: any) {
    if (!Number(control.value)) return { yearInvalid: true };
    const d = new Date();
    let year = d.getFullYear();
    if (control.value >= 1800 && control.value <= year) {
      return null;
    }

    return { yearInvalid: true };
  }

  getTeamMembers() {
    return (<FormArray>this.AboutPageForm.get('TeamMembers'))?.controls;
  }


  getStoreImages() {
    return this.AboutPageForm?.get('BasicInfo')?.get('StoreImages')?.value;
  }




  EditClicked() {
    this.Edit = !this.Edit;

    if (!this.Edit) {
      this.AboutPageForm.patchValue(this.AboutPageValues);
    }
    this.FormDisableEnable();
  }

  FormDisableEnable() {
    Object.keys(this.AboutPageForm.controls).forEach(controlName => {
      const control = this.AboutPageForm.get(controlName);
      if (control && !this.Edit) {
        console.log('conrol disable started');
        
        control.disable();
      }
      else {
        control?.enable();
      }
    });

  }

  Save() {
    this.fetchDataService.HTTPPOST(this.backendURLs.URLs.setAboutDetails, this.AboutPageForm.value).subscribe((response) => {
      this.EditClicked();
      this.FetchDetails();
    })

  }

  ImageUploadHandler(event: any, FormGroupName: any, index: any) {

    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      if (!url[0]) {
        this.toastService.errorToast('error while uploading image please try again');
        return;
      }



      let imgArray: any;
      if (FormGroupName == 'BasicInfo') {
        imgArray = (this.AboutPageForm.get('BasicInfo.StoreImages')?.value);
        if (index != 0 && !imgArray[index - 1]) {
          this.toastService.errorToast({ title: 'Please upload another images first' });
          return;
        }
        imgArray[index] = url[0];
      }

      else if (FormGroupName == 'TeamMembers') {
        if (index != 0 && !(this.AboutPageForm.get('TeamMembers') as FormArray).at(index - 1)?.get('img')?.value) {
          this.toastService.errorToast({ title: 'Please upload another images first' });
          return;
        }
        (this.AboutPageForm.get('TeamMembers') as FormArray).at(index)?.get('img')?.setValue(url[0]);
      }
    })

  }



  AddTeamMember() {
    let newTeamMember = this.fb.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
    });

    if ((this.AboutPageForm.get('TeamMembers') as FormArray).length >= 5) {
      this.toastService.errorToast({ title: 'You cannot add more than 5 TeamMembers' });
      return;
    }
    (this.AboutPageForm.get('TeamMembers') as FormArray)?.push(newTeamMember);
    // this.DummyTeamMembers();
  }

  RemoveMember(index: any) {
    if ((this.AboutPageForm.get('TeamMembers') as FormArray).length <= 1) {
      this.toastService.errorToast({title:'You cannot delete member any more'});
      return;
    }
    (this.AboutPageForm.get('TeamMembers') as FormArray).removeAt(index);
  }


  ShowUpload(index: any, form: any) {
    if (form == 'BasicInfo') {
      let array = this.AboutPageForm.get('BasicInfo.StoreImages')?.value;
      array[index] = '';
      this.AboutPageForm.get('BasicInfo.StoreImages')?.setValue(array);      
    }
    else {
      (this.AboutPageForm.get('TeamMembers') as FormArray).at(index).get('img')?.setValue('');
    }
  }


  ImageShower(index: any, form: any) {
    if (form == 'BasicInfo') {
      return this.AboutPageForm.get('BasicInfo.StoreImages')?.value[index];
    }
    else {
      return (this.AboutPageForm?.get('TeamMembers') as FormArray)?.at(index)?.get('img')?.value;
    }
  }






}


