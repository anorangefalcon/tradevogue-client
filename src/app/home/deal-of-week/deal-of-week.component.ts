import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-deal-of-week',
  templateUrl: './deal-of-week.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./deal-of-week.component.css']
})
export class DealOfWeekComponent {

  Details: any;
  constructor(private fetchDataService: FetchDataService, private backendURLs: UtilsModule) {
    this.fetchDataService.HTTPGET(this.backendURLs.URLs.getDealsDetails).subscribe((data) => {
      this.Details = data;
    })
  }



}
