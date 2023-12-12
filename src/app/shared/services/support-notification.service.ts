import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { LoginCheckService } from './login-check.service';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app'; 
import { environment } from 'src/environments/environment';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SupportNotificationService {
  private isInitialized = false;
  public hasPermission = false;

  public hasFcmToken: Observable<boolean> = this.fetchData.HTTPGET(this.utils.URLs.userFcmToken).pipe(
    map((res: any) => {
      if (res) {
        this.hasPermission = true;
        return true;
      }
      return false;
    })
  );
  




  private message: BehaviorSubject<any> = new BehaviorSubject(null);
  dataSubscription!: Subscription;
  fcmTokens: any;

  // Observable to expose notification options
  public notificationOptions$: Observable<any> = this.message.asObservable();

  constructor(private userService: LoginCheckService,
     private fetchData: FetchDataService,
      private utils: UtilsModule,
      private cookieService: CookieService,
      private loginCheckService: LoginCheckService) {
      
     }

  // it calls the initialize method and then requestPermission method
  initialize() {
    if (!this.isInitialized) {
      // this.initializeFirebase();
      initializeApp(environment.firebase);
      this.requestPermission();
      this.isInitialized = true;
    }
  }

  requestPermission() {
    // scripts run in the background, enable features like push notifications
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('./firebase-messaging-sw.js')
    //     .catch((err) => {
    //       console.error('Service Worker registration failed:', err);
    //  });
    // }

    const messaging = getMessaging();
    
    getToken(messaging, { vapidKey: environment.vapidKeyNotification })
      .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken)
        // send the distict token to server by searching in db the user with the same token and replace that
       this.dataSubscription = this.fetchData.HTTPPOST(this.utils.URLs.webPushTokenDetail, {'token': currentToken}).subscribe((response: any) => {
            console.log(response)
          });
          this.hasPermission = true;
            this.sendTokenToServer(currentToken);
        } else {
          this.hasPermission = false;
          console.log('No registration token available. Request permission to generate one.');
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

    ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
