import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  Edit:Boolean=false;
  AboutPageForm!:FormGroup
  constructor(private fb:FormBuilder,private imageuploadService:ImageUploadService,private backendURLs:UtilsModule, private fetchDataService:FetchDataService, private toastService:ToastService){
    
    this.AboutPageForm=this.fb.group({
      BasicInfo:this.fb.group({
        content:this.fb.group({
          name:['',Validators.required],
          tagline:['',Validators.required],
          description:['',Validators.required],
          foundedYear:['',[Validators.required,this.FoundedYearValidator]],
          growthDescription:['',Validators.required],
          Feature1:this.fb.group({
              heading:['',Validators.required],
              description:['',Validators.required],
            }),

            Feature2:this.fb.group({
              heading:['',Validators.required],
              description:['',Validators.required],
            }),
          
        }),
        StoreImages: this.fb.control([], Validators.required),
      }),
    TeamMembers:this.fb.array([
      this.fb.group({
        img:['',Validators.required],
        name:['',Validators.required]
      })
    ]),    
    })

    this.fetchDataService.HTTPGET((this.backendURLs.URLs.getAboutDetails)).subscribe((data:any)=>{
    this.AboutPageForm.patchValue(data);
    })    


    // this.DummyImages();
    this.FormDisableEnable();
    // this.getStoreImages();
    // this.DummyTeamMembers();
  }

  FoundedYearValidator(control:any){
    if(!Number(control.value)) return {yearInvalid:true};
    const d = new Date();
      let year = d.getFullYear();
    if(control.value>=1800 && control.value<=year){
      return null;
    }

    return {yearInvalid:true};
  }



 


  getTeamMembers() {
    return (<FormArray>this.AboutPageForm.get('TeamMembers'))?.controls;
  }


  getStoreImages(){
return this.AboutPageForm?.get('BasicInfo')?.get('StoreImages')?.value;
  }


  

 EditClicked(){
    this.Edit=!this.Edit;
    this.FormDisableEnable();
  }

  FormDisableEnable(){
    Object.keys(this.AboutPageForm.controls).forEach(controlName => {
      const control = this.AboutPageForm.get(controlName);
      if (control && !this.Edit) {
        control.disable();
      }
      else{
        control?.enable();
      }
    });
  
  }

  Save(){
   this.fetchDataService.HTTPPOST( this.backendURLs.URLs.setAboutDetails,this.AboutPageForm.value).subscribe((response)=>{
   })
  
  }

  ImageUploadHandler(event:any,FormGroupName:any,index:any){

    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      if(!url[0]){
        this.toastService.errorToast('error while uploading image please try again');
        return;
      }  

      

      let imgArray:any;
      if(FormGroupName=='BasicInfo'){  
       imgArray=(this.AboutPageForm.get('BasicInfo.StoreImages')?.value); 
        if(index!=0 && !imgArray[index-1]){
          this.toastService.errorToast({title:'Please upload another images first'});
          return;
        }
        imgArray[index]=url[0];
      } 
      
      else if(FormGroupName=='TeamMembers'){
        // console.log('previous value is ',this.AboutPageForm.get('TeamMembers') as FormArray).at(index-1)?.get('img')?.value);
        console.log('previous value is ',(this.AboutPageForm.get('TeamMembers') as FormArray).at(index-1)?.get('img')?.value)
        if(index!=0 && !(this.AboutPageForm.get('TeamMembers') as FormArray).at(index-1)?.get('img')?.value){
          this.toastService.errorToast({title:'Please upload another images first'});
          return;
        }
      (this.AboutPageForm.get('TeamMembers') as FormArray).at(index)?.get('img')?.setValue(url[0]);
      }  
    })
    
  }



  AddTeamMember(){
  let newTeamMember=  this.fb.group({
      name:['',Validators.required],
      img:['',Validators.required],
    });

    if((this.AboutPageForm.get('TeamMembers') as FormArray).length>=5){
      this.toastService.errorToast({title:'You cannot add more than 5 TeamMembers'});
      return;
    }
    (this.AboutPageForm.get('TeamMembers') as FormArray)?.push(newTeamMember);
    // this.DummyTeamMembers();
  }

  RemoveMember(index:any){
    if((this.AboutPageForm.get('TeamMembers') as FormArray).length<=1){
      this.toastService.errorToast('You cannot delete member any more');
      return;
    }
    (this.AboutPageForm.get('TeamMembers') as FormArray).removeAt(index);
  }


  ShowUpload(index:any,form:any){
    if(form=='BasicInfo'){
     let array= this.AboutPageForm.get('BasicInfo.StoreImages')?.value;
     delete array[index];
     this.AboutPageForm.get('BasicInfo.StoreImages')?.setValue(array);  
    }
    else{ 
      (this.AboutPageForm.get('TeamMembers') as FormArray).at(index).get('img')?.setValue(''); 
    }
  }


  ImageShower(index:any,form:any){
    if(form=='BasicInfo'){
      return this.AboutPageForm.get('BasicInfo.StoreImages')?.value[index];
    }
    else{
      return (this.AboutPageForm?.get('TeamMembers') as FormArray)?.at(index)?.get('img')?.value;
    }
  }



  DummyImages(){
    const imgArray:any = this.AboutPageForm.get('BasicInfo.StoreImages')?.value;
    let arr=[
      'https://images.pexels.com/photos/3965551/pexels-photo-3965551.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/5864264/pexels-photo-5864264.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];
    if(imgArray.length==0){
      this.AboutPageForm.get('BasicInfo.StoreImages')?.setValue(arr);
    }     
  }

  DummyTeamMembers(){
    let img='https://images.pexels.com/photos/7063781/pexels-photo-7063781.jpeg?auto=compress&cs=tinysrgb&w=600';
    let imgArray:any=(this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray).controls; 
  for(let image of imgArray){
       image.get('imgLink').setValue(img);
  }    
  }



}
