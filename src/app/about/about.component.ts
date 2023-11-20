import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  Data:any;
  constructor(private fetchDataService:FetchDataService,private backendUrls:UtilsModule){
    this.fetchDataService.HTTPGET((this.backendUrls.URLs.getAboutDetails)).subscribe((data)=>{
      this.Data=data;
    })
  }

}
