import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent {

  list: any = []
  direction: any = 'popup';
  show: boolean = false;
  new: string = "";
  newWishlist: string = '';
  productId: any;
  product: any;
  showTextField: boolean = false;
  showAddLabel: boolean = true;
  productName: string = "";


  constructor(private wishlistService: WishlistService,
    private toastService: ToastService) {
  }

  ngOnInit() {
    this.wishlistService.wishlistPopupData.subscribe((data)=>{
      if(!data) return;
      this.list=data.wishlists;
      this.show=true;        
    })
  }

   addToWishlist(wishlistName: string) {
    this.wishlistService.AddtoWishlist(wishlistName);
    this.show=false;
    this.showTextField=false;
    this.newWishlist = "";
  }
  


  handler(event: any) {
    this.show = event
  }
}



