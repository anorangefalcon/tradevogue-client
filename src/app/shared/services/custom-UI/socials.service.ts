import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root'
})
export class SocialsService {

  constructor(private backendURLs: UtilsModule, private http: HttpClient) { }

  getSocials() {
    return this.http.get(this.backendURLs.URLs.getSocials);
  }

  setSocials(formData: any) {
    return this.http.post(this.backendURLs.URLs.setSocials, formData);
  }
}
