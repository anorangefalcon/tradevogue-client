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
        StoreImages:this.fb.group({
          img:this.fb.array([],Validators.minLength(4)),
        }),
        active:[true,Validators.required],
      }),
      Statistics:this.fb.group({
        Sales:this.fb.group({
          Number:[''],
          color:['#000000',Validators.required],
          active:[true,Validators.required]
        }),
        HappyCustomers:this.fb.group({
          Number:[''],
          color:['#000000',Validators.required],
          active:[true,Validators.required]
        }),
        ShippedProducts:this.fb.group({
          Number:[''],
          color:['#000000',Validators.required],
          active:[true,Validators.required]
        }),

    }),
    TeamMembers:this.fb.group({
      memberInfo:this.fb.array([
        // this.fb.group({
        //   name:this.fb.control('abcd',Validators.required),
        //   imgLink:this.fb.control('',Validators.required)
        // }),

      ]),
      active:this.fb.control(true,Validators.required)
    })
      
    })

    this.fetchDataService.HTTPGET((this.backendURLs.URLs.getAboutDetails)).subscribe((data:any)=>{
;
      data.BasicInfo.StoreImages.img.forEach((el:any)=>{
        (this.AboutPageForm?.get('BasicInfo')?.get('StoreImages')?.get('img') as FormArray)?.push(this.fb.control(el));
      })
        
      data.TeamMembers.memberInfo.forEach(()=>{
        this.AddTeamMember();
      })
    this.AboutPageForm.patchValue(data);
    })

    
    
    this.FormDisableEnable();
    // this.DummyImages();
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



  getTeamMemberImage(index:any){
   return (this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray)?.at(index)?.get('imgLink')?.value;
  }
  getStoreImages(index:any){
    let  imgArray:any= this.AboutPageForm?.get('BasicInfo')?.get('StoreImages')?.get('img') as FormArray;
    return imgArray.at(index)?.value;
    }


  getTeamMembers() {
    return (<FormArray>this.AboutPageForm.get('TeamMembers')?.get('memberInfo'))?.controls

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
    let imgArray:any;
    
    if(FormGroupName=='BasicInfo'){
       imgArray = this.AboutPageForm.get('BasicInfo.StoreImages.img') as FormArray;
      if(index!=0 && !imgArray.at(index-1)?.value){
        this.toastService.errorToast('Please upload another images first');
        return;
      }
    }
    else if(FormGroupName=='TeamMembers'){
      imgArray = this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray;
     
      if(index!=0 && !imgArray.at(index-1)?.value.imgLink){
        this.toastService.errorToast('Please upload another images first');
        return;
      }
    }

   

    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      if(FormGroupName=='BasicInfo'){    
        if(!url[0]){
          this.toastService.errorToast('error while uploading image please try again');
        return;
        }   
        imgArray.insert(index,this.fb.control([url[0]]));

      }
      else if(FormGroupName=='TeamMembers'){
        // const imgArray = this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray;
        imgArray.insert(index,this.fb.control([url[0]]));
      }

    })
    
  }

  check:Boolean=true;
  ActiveStatus(event:any,data:any){
    this.AboutPageForm?.get(data)?.get('active')?.setValue(false);
    
  }




  AddTeamMember(){
  let newTeamMember=  this.fb.group({
      name:['',Validators.required],
      imgLink:['',Validators.required],
    });

    if((this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray).length>=5){
      this.toastService.errorToast('You cannot add more than 5 TeamMembers');
      return;
    }
    (this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray)?.push(newTeamMember);
    // this.DummyTeamMembers();
  }

  RemoveMember(index:any){
    if((this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray).length<=1){
      this.toastService.errorToast('You cannot delete member any more');
      return;
    }
    (this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray).removeAt(index);
  }

  DummyImages(){
    const imgArray = this.AboutPageForm.get('BasicInfo.StoreImages.img') as FormArray;
    let link='https://images.pexels.com/photos/3965551/pexels-photo-3965551.jpeg?auto=compress&cs=tinysrgb&w=600';
    imgArray.insert(0,this.fb.control(link));
    link='https://images.pexels.com/photos/5864264/pexels-photo-5864264.jpeg?auto=compress&cs=tinysrgb&w=600';
    imgArray.insert(1,this.fb.control(link));
    link='https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg?auto=compress&cs=tinysrgb&w=600';
    imgArray.insert(2,this.fb.control(link));
    link='https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=600';
    imgArray.insert(3,this.fb.control(link));

  }

  DummyTeamMembers(){
    let img='https://images.pexels.com/photos/7063781/pexels-photo-7063781.jpeg?auto=compress&cs=tinysrgb&w=600';
    let imgArray:any=(this.AboutPageForm.get('TeamMembers')?.get('memberInfo') as FormArray).controls; 
  for(let image of imgArray){
       image.get('imgLink').setValue(img);
  }    
  }



}
