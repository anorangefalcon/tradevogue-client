import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-deal-of-week',
  templateUrl: './deal-of-week.component.html',
  styleUrls: ['./deal-of-week.component.css']
})
export class DealOfWeekComponent {

  Details:any;
  constructor(private fetchDataService:FetchDataService,private backendURLs:UtilsModule){
    console.log('construcotr called-------->');
    
this.fetchDataService.HTTPGET(this.backendURLs.URLs.getDealsDetails).subscribe((data)=>{
  this.Details=data;
  console.log('Detials comign is ',this.Details);
  
})
  }

 

}
