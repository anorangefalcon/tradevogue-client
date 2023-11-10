import { Component, OnInit, Renderer2 } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { FetchDataService } from './shared/services/fetch-data.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCheckService } from './shared/services/login-check.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  message: string = '';
  messageArray: { name: string, message: any }[] = [];

  ngOnInit(): void {
    this.requestPermission()
  }

  sendMessage() {
    const data = { message: this.message };
    this.messageArray.push({ name: 'you', message: this.message });
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
  synth: any;
  voices: any;

  title = 'eCommerce-frontend';
 
  messages: any = getToken(getMessaging(), { vapidKey: 'BPgBPO552gWCPJ_rUhzgn02bC3EFAIh1EWhlyib11X58vriYlQXmqeGX9_NJ8Z1h8KjtIDpstdWTgFuC01pdFbw' });


  requestPermission() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .then(function (registration) {
        }).catch(function (err) {
        });
    }

    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BPgBPO552gWCPJ_rUhzgn02bC3EFAIh1EWhlyib11X58vriYlQXmqeGX9_NJ8Z1h8KjtIDpstdWTgFuC01pdFbw' }).then((currentToken) => {
      if (currentToken) {
        this.sendTokenToServer(currentToken);
      } else {
      }
    }).catch((err) => {
    });
  }


  sendTokenToServer(currentToken: any) {
    if (currentToken) {
      this.userService.setFcmToken(currentToken);
    }
  }


  constructor(private fetchdata: FetchDataService, private cookie: CookieService, private formBuilder: FormBuilder, private userService: LoginCheckService) {




    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();

    this.requestPermission()
    this.subscribeToMessages();

  }

  subscribeToMessages() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.handleNotificationPayload(payload);
    });
  }

  handleNotificationPayload(payload: any) {
    if (payload && payload.data) {
      const endpoint = payload.data.endpoint;
      const notificationPayload = payload.data.payload;
      const p256d = payload.data.p256d;
    }
  }
}