import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';

@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.css']
})
export class TcComponent {

  tcData : any;
  constructor (private fetchDataService : FetchDataService,
     private backendUrls : UtilsModule) {}

  ngOnInit(){
    this.fetchDataService.HTTPGET(this.backendUrls.URLs.getTandC).subscribe((data: any)=>{
      this.tcData = data.data;
      console.log(this.tcData);
    })
  }

}
