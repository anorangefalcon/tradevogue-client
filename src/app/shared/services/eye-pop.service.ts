import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root'
})
export class EyePopService {

  showEyePopup = new BehaviorSubject<any>('');
  EyePopupData = this.showEyePopup.asObservable();
  fetchData: any = new BehaviorSubject<string>('');
  sku: any;
  eyeData: [] = [];
  constructor(private fetchService: FetchDataService,
    private backendUrl: UtilsModule,
    ) { }

    ShowEyelist(sku: any) {
      let params = new HttpParams();
      params = params.set("sku", sku);
    
      this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductUrl, params).subscribe((data: any) => {
        console.log('Received data from HTTPGET:', data); // Log received data
        this.eyeData = data;
        this.showEyePopup.next(data); // Emit data
        console.log('Emitted data to subscribers:', data); // Log emitted data
      });
    }
}
