import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private backendUrls : UtilsModule, private http: HttpClient) { }

  setSales(data : any) {
    return this.http.post(this.backendUrls.URLs.setSales, data);
  }

  getSales() {
    return this.http.get(this.backendUrls.URLs.getSales);
  }

  updateItem(updatedItem: any) {
    return this.http.put(`${this.backendUrls.URLs.update}/${updatedItem._id}`, updatedItem);
  }
}