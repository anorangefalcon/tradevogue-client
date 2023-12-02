import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private backendUrls : UtilsModule, private http: HttpClient) { }

  // setNotifications(data : any) {
  //   return this.http.post(this.backendUrls.URLs.setNotifications, data);
  // }

  getRegistrationIDs() {
    return this.http.get(this.backendUrls.URLs.getFcmToken);
  }

  getNotifications() {
    return this.http.get(this.backendUrls.URLs.getNotification);
  }

  getComingNotification() {
    return this.http.get(this.backendUrls.URLs.comingNotifications);
  }

  updateItem(updatedItem: any) {
    return this.http.put(`${this.backendUrls.URLs.update}/${updatedItem._id}`, updatedItem);
  }
}