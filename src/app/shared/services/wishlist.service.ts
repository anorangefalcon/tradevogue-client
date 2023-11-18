import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { LoginCheckService } from './login-check.service';

@Injectable({
  providedIn: 'root'
})

export class WishlistService {

  showWishlistPopup = new BehaviorSubject<any>('');
  wishlistPopupData = this.showWishlistPopup.asObservable();

  WishListedProducts: any = new BehaviorSubject('');

  WishlistCount = new BehaviorSubject<any>('');
  WishlistCount$ = this.WishlistCount.asObservable();


  deleteProduct = new BehaviorSubject<any>('');
  delete$ = this.deleteProduct.asObservable();

  productId: any;
  private userIsLoggedIn: Boolean = false;

  constructor(
    private backendUrls: UtilsModule,
    private router: Router,
    private fetchDataService: FetchDataService,
    private utils: UtilsModule,
    private http: HttpClient,
    private userService: LoginCheckService,
    private toastService: ToastService,
  ) {
    this.userService.getUser().subscribe((isLoggedIn: any) => {
      this.userIsLoggedIn = isLoggedIn;
      this.getWishlistCount();
    })
  }

  ShowWishlist(productId: string) {

    if (this.userIsLoggedIn) {
      this.productId = productId;
      this.fetchDataService.HTTPGET(this.backendUrls.URLs.showWishlist).subscribe((data: any) => {
        this.showWishlistPopup.next(data);
      });
    }
    else {
      this.router.navigate(['/auth/login']);
    }

  }

  getWishlistCount() {
      if (this.userIsLoggedIn) {
        this.fetchDataService.HTTPGET(this.backendUrls.URLs.showWishlist).subscribe((data: any) => {
    
          let newData = data.wishlists.map((el: any) => {
            return el.products;
          }).flat();
          this.WishListedProducts.next(newData);
          this.WishlistCount.next(data.count);
        });
      }
  }

  AddtoWishlist(wishlistName: string) {
    if (!this.productId) return;
    const body = {
      wishlistName: wishlistName,
      productId: this.productId,
    }
    this.fetchDataService.HTTPPOST(this.utils.URLs.addToWishlist, body).subscribe((response: any) => {
      if (!response) return;
      const toast = {
        title: response.message
      }
      this.toastService.notificationToast(toast);
      // this.WishlistCount.next(this.WishlistCount.value + 1);
      this.getWishlistCount();
    })
  }

  removeFromWishlist(productId: any, wishlistName: string = '') {
    const delProduct: any = {
      productId: productId
    }
    if (wishlistName) delProduct.wishlistName = wishlistName;
    return this.fetchDataService.HTTPPOST(this.backendUrls.URLs.deleteFromWishlist, delProduct);
  }

  removeWishlist(index: any) {
    return this.http.post(this.backendUrls.URLs.removeWishlist, index);

  }

  showWishlistedProducts(wishlist: string) {
    const body = {
      wishlistName: wishlist
    }
    return this.http.post(this.backendUrls.URLs.showProducts, body);
  }

}
