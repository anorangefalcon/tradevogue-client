import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root',
})
export class EyePopService {
  showEyePopup = new BehaviorSubject<any>('');
  EyePopupData = this.showEyePopup.asObservable();

  sku: any;
  eyeData: [] = [];
  
  constructor(private fetchService: FetchDataService,private backendUrl: UtilsModule) { }

  ShowEyelist(sku: any) {
    let params = new HttpParams();
    params = params.set("sku", sku);

    this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductUrl, params).subscribe((data: any) => {
      this.eyeData = data;
      this.showEyePopup.next(data); // Emit data
    });
  }
}
