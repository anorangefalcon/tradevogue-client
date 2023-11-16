import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';

@Injectable()
export class MessagingService {
    constructor() {
        // Initialize Firebase with your configuration
        initializeApp(environment.firebase);
    
        // Use messaging
        const messaging = getMessaging();
    
        // Request permission and use messaging
        Notification.requestPermission()
          .then(() => getToken(messaging))
          .then(token => {
            // Do something with the token, e.g., update it in the database
          })
          .catch(error => {
            console.error('Error requesting permission:', error);
          });

          
    
        // Listen for messages
        onMessage(messaging, (payload) => {
          // Handle incoming messages
        });
      }
    }