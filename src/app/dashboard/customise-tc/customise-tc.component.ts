import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-customise-tc',
  templateUrl: './customise-tc.component.html',
  styleUrls: ['./customise-tc.component.css']
})
export class CustomiseTcComponent {

  TandC!: FormArray
  yourFormGroup!: FormGroup;
  contentType: any[] = ['list', 'paragraph']


  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule) {

    this.yourFormGroup = this.fb.group({

      TandC: this.fb.array([
        this.fb.group({

          heading: this.fb.control('', Validators.required),
          ContentTYPE: this.fb.control(['list', 'paragraph']),
          contentInfo: this.fb.array([
            this.fb.group({
              content_type: ['', Validators.required],
              content_description: this.fb.array([
                this.fb.group({
                  content: ['', Validators.required],
                })
              ])
            })
          ])
        })
      ])
    });
    this.getData();
  }


  getParticularContentType(i: number) {
    return this.yourFormGroup.get('TandC')?.get(String(i))?.get('ContentTYPE')?.value;
  }


  // TandC form Array
  getFormArrayControls() {
    return (<FormArray>this.yourFormGroup.get('TandC')).controls;
  }



  removeFormControl(index: number) {
    (<FormArray>this.yourFormGroup.get('TandC'))?.removeAt(index);
  }

  // contentInfo form Array
  getContentFormArrayControls(i: number) {
    return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.controls;
  }



  removeContentFormArrayControls(i: number, index: number) {
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.removeAt(index)


    let intialFormArray = (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'));
    let count: any = 0;
    intialFormArray.value.forEach((element: any) => {
      if (element.content_type == 'list') count++;
    });

    if (count < 2) {

      let arr = this.yourFormGroup.get('TandC')?.get(String(i))?.value;
      arr.ContentTYPE = ['paragraph', 'list'];
      this.yourFormGroup.get('TandC')?.get(String(i))?.setValue(arr);
    }

  }

  // contentDesc Form Array
  getContentDescFormArrayControls(i: number, j: number) {
    return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.controls;
  }

  addContentDescFormControl(i: number, j: number) {
    let form = this.fb.group({
      content: ['', Validators.required],
    });

    let FormArray = (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'));
    if (FormArray.value.length >= 7) {
      this.toastService.errorToast({ title: 'You cannot add more than 7 inputs ' });
    }
    else {
      FormArray.push(form);
    }
    // console.log('value pushed called------>');
    
  }



  removeContentDescFormControl(i: number, j: number, index: number) {

    let FormArray = (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'));
    if (FormArray.value.length == 1) {
      this.toastService.errorToast({ title: 'You cannot remove the control ' });
    }
    else {
      (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.removeAt(index);

    }

  }

  getTandCContent(i: any, j: any, content = 'content_type') {

    if (content == 'content_type') {
      return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.value;
    }
    else {
      return (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_description'))?.controls;
    }
  }

  ContentTypeHandler(event: any, i: number, j: number) {

    let FormArray = (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'));
    let count: any = 0;
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.setValue(event);
    FormArray.value.forEach((element: any) => {
      if (element.content_type == 'list') count++;
    });

    if (count > 2) {
      this.toastService.errorToast({ title: 'You cannot add more than 3 lists in one section' });
      let arr = this.yourFormGroup.get('TandC')?.get(String(i))?.value;
      arr.ContentTYPE = ['paragraph'];
      this.yourFormGroup.get('TandC')?.get(String(i))?.setValue(arr);
      (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.setValue('paragraph');

    }

  }

  addContentInfo(i: any) {
    console.log(this.getFormArrayControls(), " abc si ")
  }

  onsubmit() {
    console.log(this.yourFormGroup.value, " status is ", this.yourFormGroup.valid);

    this.fetchDataService.HTTPPOST(this.backendUrl.URLs.setTandC, this.yourFormGroup.value).subscribe((res: any) => {
      console.log(res, "save res");
      this.toastService.successToast({title: res.message})

    })
  }

  // AddContentInfo(index: any, value: any) {
  //   if (Array.isArray(value)) {
  //     (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(index))).get('contentInfo')).push(
  //       this.fb.group({
  //         content_type: ['', Validators.required],
  //         content_description: this.fb.array(['', Validators.required])
  //       }))
  //   }
  //   else {
  //     (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(index))).get('contentInfo')).push(
  //       this.fb.group({
  //         content_type: ['', Validators.required],
  //         content_description: ['', Validators.required]
  //       })
  //     )
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

    let FormArray = (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'));
    if (FormArray.value.length >= 5) {
      this.toastService.errorToast({ title: 'You cannot add more than 5 controls ' });
    }
    else {
      (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.push(form);
    }
  }



  addFormControl() {
    let form = this.fb.group({
      heading: this.fb.control('', Validators.required),
      ContentTYPE: this.fb.control(['list', 'paragraph']),
      contentInfo: this.fb.array([
        this.fb.group({
          content_type: ['', Validators.required],
          content_description: this.fb.array([
            this.fb.group({
              content: ['', Validators.required],
            })
          ])
        })
      ])
    });
    (<FormArray>this.yourFormGroup.get('TandC'))?.push(form);
  }

  getData() {
    this.fetchDataService.HTTPGET(this.backendUrl.URLs.getTandC).subscribe((response: any) => {

      for (let i = 0; i < response.data.length - 1; i++) {
        this.addFormControl();
        for (let j = 0; j < response.data[i].contentInfo.length - 1; j++) {
          this.addContentFormControl(i);

          for (let k = 0; k < response.data[i].contentInfo[j].content_description.length - 1; k++) {
            this.addContentDescFormControl(i, j);

          }
        }

      }

      this?.yourFormGroup?.get('TandC')?.patchValue(response?.data);
    })
  }
}
