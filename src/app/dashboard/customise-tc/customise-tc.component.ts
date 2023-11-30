import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-customise-tc',
  templateUrl: './customise-tc.component.html',
  styleUrls: ['./customise-tc.component.css']
})
export class CustomiseTcComponent {

  tcFormArray!: FormArray
  tcForm!: FormGroup;
  cachedFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule) {
    this.tcForm = this.fb.group({
      tcFormArray: this.fb.array([
      ])
    });
    this.getData();
  }

  discardChanges() {
    this.tcForm = this.cachedFormGroup;
  }

  getParticularContentType(i: number) {
    return this.tcForm.get('tcFormArray')?.get(String(i))?.get('ContentTYPE')?.value;
  }


  // tcFormArray form Array
  getFormArrayControls() {
    return (<FormArray>this.tcForm.get('tcFormArray')).controls;
  }

  removeFormControl(index: number) {
    (<FormArray>this.tcForm.get('tcFormArray'))?.removeAt(index);
    this.toastService.warningToast({title: "Section removed!"})
  }

  // contentInfo form Array
  getContentFormArrayControls(i: number) {
    return (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.controls;
  }

  removeContentFormArrayControls(i: number, index: number) {
    (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.removeAt(index)


    let intialFormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'));
    let count: any = 0;
    intialFormArray.value.forEach((element: any) => {
      if (element.content_type == 'list') count++;
    });

    if (count < 2) {

      let arr = this.tcForm.get('tcFormArray')?.get(String(i))?.value;
      arr.ContentTYPE = ['paragraph', 'list'];
      this.tcForm.get('tcFormArray')?.get(String(i))?.setValue(arr);
    }

  }

  // contentDesc Form Array
  getContentDescFormArrayControls(i: number, j: number) {
    return (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.controls;
  }

  addContentDescFormControl(i: number, j: number) {
    let form = this.fb.group({
      content: ['', Validators.required],
    });

    let FormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'));
    if (FormArray.value.length >= 7) {
      this.toastService.errorToast({ title: 'You cannot add more than 7 inputs ' });
    }
    else {
      FormArray.push(form);
    }
    // console.log('value pushed called------>');

  }

  removeContentDescFormControl(i: number, j: number, index: number) {

    let FormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'));
    if (FormArray.value.length == 1) {
      this.toastService.errorToast({ title: 'There must be atleast 1 point in the list.' });
    }
    else {
      (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.removeAt(index);

    }

  }

  gettcFormArrayContent(i: any, j: any, content = 'content_type') {

    if (content == 'content_type') {
      return (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.value;
    }
    else {
      return (<FormArray>(<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_description'))?.controls;
    }
  }

  ContentTypeHandler(event: any, i: number, j: number) {

    let FormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'));
    let count: any = 0;
    (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.setValue(event);
    FormArray.value.forEach((element: any) => {
      if (element.content_type == 'list') count++;
    });

    if (count > 2) {
      this.toastService.errorToast({ title: 'You cannot add more than 3 lists in one section' });
      let arr = this.tcForm.get('tcFormArray')?.get(String(i))?.value;
      arr.ContentTYPE = ['paragraph'];
      this.tcForm.get('tcFormArray')?.get(String(i))?.setValue(arr);
      (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.setValue('paragraph');

    }

  }


  onsubmit() {
    console.log(this.tcForm.value, "lol");
    
    this.fetchDataService.HTTPPOST(this.backendUrl.URLs.setTandC, this.tcForm.value).subscribe((res: any) => {
      this.toastService.successToast({ title: res.message })
      this.cachedFormGroup = _.cloneDeep(this.tcForm);
      this.tcForm.disable();
    })
  }

  // NEW CODE
  // addContentFormControl(i: number) {
  //   let form = this.fb.group({
  //     content_type: ['', Validators.required],
  //     content_description: this.fb.array([
  //       // this.fb.group({
  //       //   content: ['', Validators.required],
  //       // })
  //     ])
  //   });

  //   let FormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'));
  //   if (FormArray.value.length >= 5) {
  //     this.toastService.errorToast({ title: 'You cannot add more than 5 controls ' });
  //   }
  //   else {
  //     FormArray.push(form);
  //   }
  // }


  addContentFormControl(i: number) {
    let form = this.fb.group({
      content_type: ['', Validators.required],
      content_description: this.fb.array([
        this.fb.group({
          content: ['', Validators.required],
        })
      ])
    });

    let FormArray = (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'));
    if (FormArray.value.length >= 5) {
      this.toastService.errorToast({ title: 'You cannot add more than 5 controls ' });
    }
    else {
      (<FormArray>this.tcForm.get('tcFormArray')?.get(String(i))?.get('contentInfo'))?.push(form);
    }
  }

  addFormControl() {
    let form = this.fb.group({
      heading: this.fb.control('', Validators.required),
      ContentTYPE: this.fb.control(['list', 'paragraph']),
      contentInfo: this.fb.array([
      ])
    });

    (<FormArray>this.tcForm.get('tcFormArray'))?.push(form);
    
  }
  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
  getData() {
    this.fetchDataService.HTTPGET(this.backendUrl.URLs.getTandC).subscribe((response: any) => {
      console.log(response, "tc res");
      
      for (let i = 0; i < response.data.length; i++) {
        this.addFormControl();
        for (let j = 0; j < response.data[i].contentInfo.length; j++) {
          this.addContentFormControl(i);

          for (let k = 0; k < response.data[i].contentInfo[j].content_description.length - 1; k++) {
            this.addContentDescFormControl(i, j);
          }
        }

      }

      this?.tcForm?.get('tcFormArray')?.patchValue(response?.data);
      this.cachedFormGroup = _.cloneDeep(this.tcForm);
      this.tcForm.disable();
    })
  }

}