import { WishlistService } from './shared/services/wishlist.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { FetchDataService } from './shared/services/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';

import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  message:string = '';
  messageArray: { name: string, message: any }[] = [];

  ngOnInit(): void {
    // this.requestPermission();
  }

  sendMessage(){
    const data = { message:this.message };
    this.messageArray.push({name:'you', message:this.message});
    this.message = '';
  }

 speak(string: any) {
  let u = new SpeechSynthesisUtterance(string);
  u.text = string;
  u.lang = "en-US";
  u.volume = 1; //0-1 interval
  u.rate = 1;
  u.pitch = 1; //0-2 interval
  this.synth.speak(u);
}

  // messageArray = [];
  synth:any;
  voices:any;

  title = 'eCommerce-frontend';
  showWishlistsDialog: boolean = false;
  // messages: any = getToken(getMessaging(), { vapidKey: 'BPgBPO552gWCPJ_rUhzgn02bC3EFAIh1EWhlyib11X58vriYlQXmqeGX9_NJ8Z1h8KjtIDpstdWTgFuC01pdFbw' });


  // requestPermission() {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('./firebase-messaging-sw.js')
  //       .then(function (registration) {
  //         console.log('Registration successful, scope is:', registration.scope);
  //       }).catch(function (err) {
  //         console.log('Service worker registration failed, error:', err);
  //       });
  //   }

  //   const messaging = getMessaging();
  //   getToken(messaging, { vapidKey: 'BPgBPO552gWCPJ_rUhzgn02bC3EFAIh1EWhlyib11X58vriYlQXmqeGX9_NJ8Z1h8KjtIDpstdWTgFuC01pdFbw' }).then((currentToken) => {
  //     if (currentToken) {
  //       console.log('current tokens for client: ', currentToken);
  //       this.sendTokenToServer(currentToken);
  //     } else {
  //       console.log('No registration token available. Request permission to generate one.');
  //     }
  //   }).catch((err) => {
  //     console.log('An error occurred while retrieving token. ', err);
  //   });
  // }
  

  sendTokenToServer(currentToken: any) {
    if (currentToken) {
      this.cookie.set('fcmToken', currentToken);
      
    }
  }

  
  constructor(private wishlistService: WishlistService, private fetchdata: FetchDataService, private cookie: CookieService, private formBuilder: FormBuilder) {
    this.wishlistService.display$.subscribe((data) => {
      this.showWishlistsDialog = data;
    });

    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();

    // this.requestPermission()
 this.subscribeToMessages();

  }

  subscribeToMessages() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('FCM message received:', payload);
      this.handleNotificationPayload(payload);
    });
  }

  handleNotificationPayload(payload: any) {
    if (payload && payload.data) {
      const endpoint = payload.data.endpoint;
      const notificationPayload = payload.data.payload;
      const p256d = payload.data.p256d;

      console.log('Endpoint:', endpoint);
      console.log('Notification Payload:', notificationPayload);
      console.log('P-256D:', p256d);
    }
  }
}