import { Component } from '@angular/core';
import { FetchDataService } from './shared/services/fetch-data.service';
import { ToastService } from './shared/services/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  'title': 'tradevogue';

  constructor(private fetchDataService: FetchDataService,private toastService:ToastService) { }

  ngOnInit(): void {   
    // this.toastService.successToast({title:'hello'});
    // this.toastService.errorToast({title:'hello 2'}); 
  }

}