import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginCheckService } from './login-check.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';  // Import initializeApp from the main Firebase module
import { environment } from 'src/environments/environment';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
@Injectable({
  providedIn: 'root'
})
export class SupportNotificationService {
  private isInitialized = false;
  public hasPermission = false;
  private message: BehaviorSubject<any> = new BehaviorSubject(null);

  // Observable to expose notification options
  public notificationOptions$: Observable<any> = this.message.asObservable();

  constructor(private userService: LoginCheckService, private fetchData: FetchDataService, private utils: UtilsModule) {
  }

  initializeFirebase() {
    if (!this.isInitialized) {
      initializeApp(environment.firebase);
      this.isInitialized = true;
    }
  }

  initialize() {
    if (!this.isInitialized) {
      this.initializeFirebase();
      this.requestPermission();
      this.subscribeToMessages();
      this.isInitialized = true;
    }
  }

  subscribeToMessages() {
    const messaging = getMessaging();

    onMessage(messaging, (payload) => {
      this.handleNotificationPayload(payload);
      this.message.next(payload);
    });
  }

  handleNotificationPayload(payload: any) {
  
    if (payload && payload.data) {
      const endpoint = payload.data.endpoint;
      const notificationPayload = payload.data.payload;
      const p256d = payload.data.p256d;
      // Do something with endpoint, notificationPayload, and p256d
    }
  
    if (payload && payload.notification) {
      const title = payload.notification.title;
      const body = payload.notification.body;

    }
  }

  requestPermission() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
     });
    }

    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.vapidKeyNotification })
      .then((currentToken) => {
        if (currentToken) {
           this.fetchData.HTTPPOST(this.utils.URLs.webPushTokenDetail, {'token': currentToken}).subscribe((response: any) => {
          });
          this.subscribeToMessages();
          this.hasPermission = true;
            this.sendTokenToServer(currentToken);
        } else {
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

 async sendTokenToServer(currentToken: any) {
    if (currentToken) {
      this.userService.setFcmToken(currentToken);
    }
  }
}
