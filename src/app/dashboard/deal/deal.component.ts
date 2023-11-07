import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.css']
})
export class DealComponent {
  DealForm!:FormGroup;
  alignments:any[]=['Left','Right'];
  constructor(private fetchService: FetchDataService,private imageuploadService:ImageUploadService, private toastService:ToastService, private backendURLs: UtilsModule, private fb: FormBuilder) {
    this.DealForm = fb.group(
      {
        productImage: fb.control('', [Validators.required]),
        Title: fb.control('', [Validators.required]),
        subTitle: fb.control('', [Validators.required]),
        buttonLink: ['', Validators.required],
        buttonText:['',Validators.required],
        contentAlign: ['Left', Validators.required],
        colors: this.fb.group({
          titleColor: ['', Validators.required],
          subTitleColor: ['', Validators.required],
          buttonColor: ['', Validators.required],
        backgroundColor:['', Validators.required]
        })
      });

    
      this.fetchService.HTTPGET(this.backendURLs.URLs.getDealsDetails).subscribe((data:any)=>{
          this.DealForm.patchValue(data);
      })

  }



  AlignmentHandler(event:any){
    this.DealForm.get('contentAlign')?.setValue(event);
  }


  Save(){

    console.log('value coming is--------------> ',this.DealForm.get('productImage')?.value);
    
    if(!this.DealForm.get('productImage')?.value){
      this.toastService.errorToast({title:'error',body:'Image uploading...'});
      return;
    }

    return;
    this.fetchService.HTTPPOST(this.backendURLs.URLs.setDeals,this.DealForm.value).subscribe((data)=>{
    this.toastService.successToast({title:'Sucess',body:'Form Submitted sucess'});
    })
    
    
  }

  bannerImageUpload(event: any) {
    console.log(event,"---------");
    
    let file: any = (<HTMLInputElement>event.target)?.files![0];
    this.imageuploadService.fileupload([{ file: file }]).then((url: any) => {
      console.log(url);
      this.DealForm.get('productImage')?.setValue(url[0]);
    })
  }
}
