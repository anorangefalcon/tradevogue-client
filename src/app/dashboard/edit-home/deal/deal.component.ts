import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.css']
})
export class DealComponent {
  DealForm!:FormGroup;
  allSubscriptions: Subscription[] = [];
  Edit:boolean=false;
  alignments:any[]=['Left','Right'];
  CopyDealForm:any
  constructor(private fetchService: FetchDataService,private imageuploadService:ImageUploadService, private toastService:ToastService, private backendURLs: UtilsModule, private fb: FormBuilder) {
    this.DealForm = fb.group(
      {
        productImage: fb.control('', [Validators.required]),
        Title: fb.control('', [Validators.required]),
        subTitle: fb.control('', [Validators.required]),
        buttonLink: ['', Validators.required],
        buttonText:['',Validators.required],
        contentAlign: ['', Validators.required],
        colors: this.fb.group({
          titleColor: ['', Validators.required],
          subTitleColor: ['', Validators.required],
          buttonColor: ['', Validators.required],
        backgroundColor:['', Validators.required]
        })
      });

      this.getDetails();
      this.FormDisableEnable();
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }

  AlignmentHandler(event:any){
    this.DealForm.get('contentAlign')?.setValue(event);
  }

  getDetails(){
    this.allSubscriptions.push(
    this.fetchService.HTTPGET(this.backendURLs.URLs.getDealsDetails).subscribe((data:any)=>{
      this.CopyDealForm=JSON.parse(JSON.stringify(data));
          this.DealForm.patchValue(data);
      })
    )
  }

 

  Save(){ 
    if(!this.DealForm.get('productImage')?.value){
      this.toastService.errorToast({title:'Wait while image is still uploading'});
      return;
    }
    
    this.allSubscriptions.push(
    this.fetchService.HTTPPOST(this.backendURLs.URLs.setDeals,this.DealForm.value).subscribe((data)=>{
    this.toastService.successToast({title:'Sucessfully Uploaded Deal Details'});
    this.getDetails();
    }));
    this.EditClicked();
  }

  
  getProductImage(){
    return this.DealForm.get('productImage')?.value;
  }

  CloseIconClicked(){
    this.DealForm.get('productImage')?.setValue('');
  }

  imageUpload: boolean = false;

  bannerImageUpload(event: any) {
    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageUpload = true;
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      this.DealForm.get('productImage')?.setValue(url[0]);
      this.imageUpload = false;
      // this.Edit=!this.Edit;
    })
  }

  EditClicked(){
    this.Edit=!this.Edit;
    if(!this.Edit){
      this.DealForm.patchValue(this.CopyDealForm);
    }
    this.FormDisableEnable();
  }

  FormDisableEnable(){
    if(!this.Edit){
      this.DealForm.disable();
      return;
    }
    this.DealForm.enable();
  }
  // Direction:any[]=['deal','home','popular']

}
