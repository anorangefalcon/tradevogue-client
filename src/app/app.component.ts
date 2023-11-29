import { Component } from '@angular/core';
import { FetchDataService } from './shared/services/fetch-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  'title': 'tradevogue';

  constructor(private fetchDataService: FetchDataService) { }

  ngOnInit(): void {      
  }

}