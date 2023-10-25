import { Component, OnInit, Renderer2 } from '@angular/core';
import { WishlistService } from './shared/services/wishlist.service';
import {getMessaging , getToken } from 'firebase/messaging';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

    title = 'eCommerce-frontend';
    showWishlistsDialog : boolean = false;

    requestPermission() {
      const messaging = getMessaging();
      getToken(messaging, { vapidKey: environment.firebase.vpaidkey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('current token for client: ', currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
    }

    constructor(private wishlistService:WishlistService){
      this.wishlistService.display$.subscribe((data)=>{
        console.log('data is -----------',data);
        this.showWishlistsDialog=data;
      })
    }
   }