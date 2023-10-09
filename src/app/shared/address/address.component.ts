import { Component } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  display:boolean = false;
  constructor(private fetchService:FetchDataService, private backendURLs: UtilsModule){}
  AddressData:any='';
  UpdatingRequest:any
  async ngOnInit() {
    this.AddressData=await this.fetchService.httpGet(this.backendURLs.URLs.getAddress);
    this.AddressData=this.AddressData.info.address
  
  }

  close(){
    this.display=false;
  }

  AddressHandler(event:any){
    this.display=false;
    if(!event._id){

      this.AddressData.push(event);
      return;
    }

    this.AddressData[event.index]=event;

    
  }


  Edit(el:any,index :any){
    el.index=index;
    this.UpdatingRequest=el;
    this.display=true;
  }


}
