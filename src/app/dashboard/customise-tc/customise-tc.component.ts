import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customise-tc',
  templateUrl: './customise-tc.component.html',
  styleUrls: ['./customise-tc.component.css']
})
export class CustomiseTcComponent {

  TandC!:FormArray
  constructor(private fb:FormBuilder){
      this.TandC=this.fb.array([
          this.fb.group({
            heading:this.fb.control([''],Validators.required),
            contentInfo:this.fb.array([
              this.fb.group({
                content_type:['',Validators.required],
                // content_description:[]
              })
            ])
          })
      ]);
    }


    getTandC() {
      return (<FormArray>this.TandC)?.controls;
    }

  
}
