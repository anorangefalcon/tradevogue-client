import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../shared/services/wishlist.service';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ToastService } from '../shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent {

  list: any = []
  width: string = '300px';
  direction: any = 'popup';
  show: boolean = false;
  new: string = "";
  newWishlist: string = '';
  productId: any;
  product: any;
  showTextField: boolean = false;
  showAddLabel: boolean = true;
  productName: string = "";
  allSubscriptions: Subscription[] = [];

  constructor(private wishlistService: WishlistService,
    private toastService: ToastService,
    private fetchDataService: FetchDataService,
    private utils: UtilsModule,) {
  }

  ngOnInit() {
    this.allSubscriptions.push(
    this.wishlistService.wishlistPopupData.subscribe((data) => {
      console.log(data, "wishlist data init");

      if (!data) return;
      this.list = data.wishlists;
      this.show = true;
    }));
  }

  addToWishlist(wishlistName: string, type: String = '') {

    const body = {
      wishlistName: wishlistName,
      productId: this.wishlistService.productId,
      type : type
    }
    this.allSubscriptions.push(
    this.fetchDataService.HTTPPOST(this.utils.URLs.addToWishlist, body).subscribe(
      {
        next: (res: any) => {
          if (!res) return;
          const toast = {
            title: res.message
          }
          this.toastService.notificationToast(toast);
          this.wishlistService.getWishlistCount();
          
          this.newWishlist = "";
          this.showTextField = false;
          this.show = false;
        }
      }
    ));
  }

  handler(event: any) {
    this.showTextField = false;
    this.show = event
    // this.wishlistService.showWishlistPopup.
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
   }
}



