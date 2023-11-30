import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  Data:any;
  dataSubscription!: Subscription;

  constructor(fetchDataService:FetchDataService,private backendUrls:UtilsModule){

    this.dataSubscription = fetchDataService.HTTPGET((this.backendUrls.URLs.getAboutDetails)).subscribe((data)=>{
      this.Data=data;
    });
    // this.fetchDataService.HTTPGET((this.backendUrls.URLs.getOverAllDetails)).subscribe((data: any)=>{
    //   console.log('res', data)
    // });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

}