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

  TandC!:FormArray
  yourFormGroup!: FormGroup;
contentType:any[]=['list','paragraph']
  constructor(private fb:FormBuilder,private fetchDataService:FetchDataService,private backendUrl:UtilsModule){
    this.yourFormGroup = this.fb.group({
      TandC:this.fb.array([
          // this.fb.group({
          //   heading:this.fb.control([''],Validators.required),
          //   contentInfo:this.fb.array([
          //     this.fb.group({
          //       content_type:['',Validators.required],
          //       // content_description:[]
          //     })
          //   ])
          // })
      ])

    });
      this.getData();

    }


    getTandC() {

      return (<FormArray>this.yourFormGroup.get('TandC')).controls;
    }

    getTandCContent(i:any,j:any,content='content_type'){
      if(content=='content_type'){
        return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_type')?.value;
      }
      else{
        console.log("xyz is ",(<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_description'))

        // return this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo')?.get(String(j))?.get('content_description') as FormArray;
        return (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(i))?.get('contentInfo'))?.get(String(j))?.get('content_description'))?.controls;
      }
    
    }


    ContentTypeHandler(event:any){

    }


    addFormControl(){
      (<FormArray>this.yourFormGroup.get('TandC'))?.push(
        this.fb.group({
          heading:this.fb.control([''],Validators.required),
          contentInfo:this.fb.array([])
        })
      )
    }


    addContentInfo(i:any){
     console.log( this.getTandC()," abc si ")
    }


    getContentInfoArray(index: number){
      return (<FormArray>this.yourFormGroup.get('TandC')?.get(String(index))?.get('contentInfo'))?.controls;
    }

    AddContentInfo(index:any,value:any){
      if(Array.isArray(value)){
        (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(index))).get('contentInfo')).push(
          this.fb.group({
          content_type:['',Validators.required],
          content_description:this.fb.array(['',Validators.required])
        }))
      }
      else{
        (<FormArray>(<FormArray>this.yourFormGroup.get('TandC')?.get(String(index))).get('contentInfo')).push(
          this.fb.group({
          content_type:['',Validators.required],
                    content_description:['',Validators.required]
        })
        )
      }
      
    }

    getData(){
      this.fetchDataService.HTTPGET(this.backendUrl.URLs.getTandC).subscribe((response:any)=>{

      
      response.data.forEach((el:any,index:any)=>{
        this.addFormControl();
        el.contentInfo.forEach((value:any)=>{
          
          this.AddContentInfo(index,value.content_description);
        })

      })

    this?.yourFormGroup?.get('TandC')?.patchValue(response?.data);
        
    console.log('this your form is ',this.yourFormGroup);
    
    })

    }
    //     // console.log('get tc a is ',this.getTandCContent());
    //     response.data.forEach((el:any) => {
    //       console.log('el is ',el);
          
    //       console.log('this get Tand c is ',this.getTandC());
    //       el.contentInfo.forEach((e:any)=>{
    //         // this.getTandC()[0]?.get('contentInfo')?.push(this.fb.group({
    //         //           content_type:['',Validators.required],
    //         //           content_description:[]
    //         //         }))
    //       })
    //       // this.getTandC()?.push(
    //       //   this.fb.group({
    //       //     heading:this.fb.control([''],Validators.required),
    //       //     contentInfo:this.fb.array([
    //       //       this.fb.group({
    //       //         content_type:['',Validators.required],
    //       //         // content_description:[]
    //       //       })
    //       //     ])
    //       //   })
            
           
            
    //       //   // this.getTandC()

    //       // ) 


    //       // response.
    //       // el.contentInfo.forEach((e:any)=>{
    //         // this.getTandC()[0]?.get('contentInfo')?.push(this.fb.group({
    //         //         content_type:['',Validators.required],
    //         //         content_description:[]
    //         //       }))
    //       })


    //       // (<FormArray>(this?.yourFormGroup?.get('TandC'))).controls?.push(this.fb.group({
    //       //     heading:this.fb.control([''],Validators.required),
    //       //     contentInfo:this.fb.array([
    //       //       this.fb.group({
    //       //         content_type:['',Validators.required],
    //       //         // content_description:[]
    //       //       })
    //       //     ])
    //       //   }));
    //     });

    //       this?.yourFormGroup?.get('TandC')?.patchValue(response?.data);
    //       console.log('Tand c si-----> ', this.getTandC()[0]?.get('contentInfo'));
          
    //   })
    // }



  
}
