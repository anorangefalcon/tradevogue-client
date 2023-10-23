import { Component, Renderer2 } from '@angular/core';
import { WishlistService } from './shared/services/wishlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'eCommerce-frontend';
    showWishlistsDialog : boolean = false

    constructor(private wishlistService:WishlistService){
      this.wishlistService.display$.subscribe((data)=>{
        console.log('data is -----------',data);
        this.showWishlistsDialog=data;
      })
    }
   }