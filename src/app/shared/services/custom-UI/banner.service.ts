import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private backendUrls : UtilsModule, private http: HttpClient) { }

  setBanners(data : any) {
    return this.http.post(this.backendUrls.URLs.setBanners, data);
  }

  getBanners() {
    return this.http.get(this.backendUrls.URLs.getBanners);
  }

  deleteBanner(data: any){
    return this.http.post(this.backendUrls.URLs.deleteBanner, data)
  }

  updateBanner(data: any) {
    return this.http.post(this.backendUrls.URLs.updateBanner, data)
  }

  toggleBanner(data: any){
    return this.http.post(this.backendUrls.URLs.toggleBanner, data)
  }
  
}
