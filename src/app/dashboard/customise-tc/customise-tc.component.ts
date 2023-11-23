import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-customise-tc',
  templateUrl: './customise-tc.component.html',
  styleUrls: ['./customise-tc.component.css']
})
export class CustomiseTcComponent {

  TandC!: FormArray
  yourFormGroup!: FormGroup;
  contentType: any[] = ['List', 'Paragraph']


  constructor(
    private fb: FormBuilder,
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule) {

    this.yourFormGroup = this.fb.group({

      TandC: this.fb.array([
        this.fb.group({

          heading: this.fb.control([''], Validators.required),

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

  // TandC form Array
  getFormArrayControls() {
    return (<FormArray>this.yourFormGroup.get('TandC')).controls;
  }

  addFormControl() {
    let form = this.fb.group({
      heading: this.fb.control([''], Validators.required),
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

  // contentInfo form Array
  getContentFormArrayControls(i: number) {
    return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.controls;
  }

  addContentFormControl(i: number) {
    let form = this.fb.group({
      content_type: ['', Validators.required],
      content_description: this.fb.array([
        this.fb.group({
          content: ['', Validators.required],
        })
      ])
    });
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.push(form);
  }

  removeContentFormArrayControls(i: number, index: number) {
    return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.removeAt(index);
  }

  // contentDesc Form Array
  getContentDescFormArrayControls(i: number, j: number) {
    return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.controls;
  }

  addContentDescFormControl(i: number, j: number) {
    let form = this.fb.group({
      content: ['', Validators.required],
    });
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.push(form);
  }

  removeContentDescFormControl(i: number, j: number, index: number) {
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description'))?.removeAt(index);
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
    (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.setValue(event);
    console.log((<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.value);
  }

  addContentInfo(i: any) {
    console.log(this.getFormArrayControls(), " abc si ")
  }

  onsubmit() {
    console.log(this.yourFormGroup.value);
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

  getData() {
    this.fetchDataService.HTTPGET(this.backendUrl.URLs.getTandC).subscribe((response: any) => {

      console.log(response);

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

      console.log('this your form is ', this.yourFormGroup);

    })
  }
}
