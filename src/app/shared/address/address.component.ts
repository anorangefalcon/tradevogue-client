import { Component } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  display:boolean = false;
  DetailsForm: FormGroup;
  constructor(private fetchService:FetchDataService, private backendURLs: UtilsModule,private fb: FormBuilder){
    this.DetailsForm = fb.group(
      {
        firstname: fb.control('', [Validators.required]),
        lastname: fb.control('', [Validators.required]),
        apartment: fb.control('', [Validators.required]),
        area: fb.control('', [Validators.required]),
        landmark: fb.control('', [Validators.required, ]),
        pincode: fb.control('', [Validators.required, ]),
        town_city:fb.control('', [Validators.required, ]),
        state:fb.control('', [Validators.required, ]),
        country:fb.control('', [Validators.required, ]),
      });

  }
  AddressData:any=[];
  UpdatingRequest:any
  async ngOnInit() {
    this.AddressData=await this.fetchService.httpGet(this.backendURLs.URLs.getAddress);
    this.AddressData=this.AddressData.info.address
  
  }

  close(){
    this.display=false;
  }

  // AddressHandler(event:any){
  //   this.display=false;
  //   if(!event._id){

  //     this.AddressData.push(event);
  //     return;
  //   }

  //   this.AddressData[event.index]=event;

    
  // }

  AddressHandler(){

  }
  Edit(el:any,index :any){
    el.index=index;
    this.UpdatingRequest=el;
    this.display=true;
  }


}
