import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class EyePopupService {
  showEyePopup = new BehaviorSubject<any>('');
  EyePopupData = this.showEyePopup.asObservable();
  fetchData = new BehaviorSubject<string>('');
  sku: any;
  eyeData: [] = [];
  constructor(private fetchService: FetchDataService,
    private backendUrl: UtilsModule) { }

    ShowEyelist(sku: any) {
      let params = new HttpParams();
      params = params.set("sku", sku);
    
      this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductUrl, params).subscribe((data: any) => {
        console.log(data, "data is ");

        this.eyeData = data;

        this.showEyePopup.next(data);
      });
    }
}
