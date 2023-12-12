import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/backend-urls';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.css']
})
export class TcComponent {

  tcData: any;
  dataSubscription!: Subscription;

  constructor(private fetchDataService: FetchDataService,
    private backendUrls: UtilsModule) { }

  ngOnInit() {
    this.dataSubscription = this.fetchDataService.HTTPGET(this.backendUrls.URLs.getTandC).subscribe((data: any) => {
      this.tcData = data.data;
    })
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
