import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

@Injectable()
export class FcmPushService {

  messaging = getMessaging();
  currentMessage = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    initializeApp(environment.firebase); // Make sure you've set up your Firebase configuration
  }

  updateToken(token: any) {
    this.afAuth.authState.pipe(
      take(1)
    ).subscribe(user => {
      if (!user) return;
      const data = { [user.uid]: token };
      this.db.object('tokens/').update(data);
    });
  }

  getPermission() {
    Notification.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return getToken(this.messaging);
      })
      .then(token => {
        console.log(token);
        this.updateToken(token);
      })
      .catch(err => {
        console.error('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
    onMessage(this.messaging, (payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload);
    });
  }
}
