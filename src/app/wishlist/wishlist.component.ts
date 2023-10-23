import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent implements OnInit {

  wishlistsArray : any[] = []
  list : any = []
  name = "jahnavi"

  constructor (private wishlistService: WishlistService) {
    console.log("constructor");

    this.wishlistService.send$.subscribe((data)=>{    
      this.wishlistsArray = data
      console.log(this.wishlistsArray, "array");
      this.list = this.wishlistsArray.map(item => item['wishlistName']);
      console.log(this.list, "list"); 

    })
  }
  
  ngOnInit() {
    console.log("hello ngoninit");
  }
  
  Close(){
    this.wishlistService.showWishlistsDialog.next(false);
  }

}
