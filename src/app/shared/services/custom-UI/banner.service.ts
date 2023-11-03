import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private backendUrls : UtilsModule, private http: HttpClient) { }

  setBanners(data : any) {
    return this.http.post(this.backendUrls.URLs.setBanners, data);
  }
}
