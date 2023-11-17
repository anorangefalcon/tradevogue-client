import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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

  constructor(private cookie: CookieService,
    private fetchService: FetchDataService,
    private backendUrls: UtilsModule,
    private router: Router,
    private fetchDataService: FetchDataService,
    private utils: UtilsModule,
    private http: HttpClient,
    private userService:LoginCheckService,
    private toastService: ToastService,
    

  ) { }


  ShowWishlist(productId: string) {
    this.userService.getUser().subscribe((IsLogin)=>{
      if (IsLogin) {
        this.productId = productId;
        this.fetchDataService.HTTPGET(this.backendUrls.URLs.showWishlist).subscribe((data: any) => {
          this.showWishlistPopup.next(data);     
        });
      }
      else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getWishlistCount() {
    console.log('get Wishlist count is ---------->');
    
    // const IsLogin = this.cookie.get('userToken')
    this.userService.getUser().subscribe((IsLogin)=>{
      if (IsLogin) {
        this.fetchDataService.HTTPGET(this.backendUrls.URLs.showWishlist).subscribe((data: any) => {
    
          let newData = data.wishlists.map((el: any) => {
            return el.products;
          }).flat();
          this.WishListedProducts.next(newData);
          this.WishlistCount.next(data.count);
        });
      }
    })
   
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
        title : response.message
      }
      this.toastService.notificationToast(toast);
      // this.WishlistCount.next(this.WishlistCount.value + 1);
      this.getWishlistCount();
    })
  }

removeFromWishlist(productId: any, wishlistName: string='') {
    const delProduct:any = {
      productId: productId
    }
    if(wishlistName) delProduct.wishlistName=wishlistName;
    return this.fetchDataService.HTTPPOST(this.backendUrls.URLs.deleteFromWishlist, delProduct);
    let delData = this.fetchDataService.HTTPPOST(this.backendUrls.URLs.deleteFromWishlist, delProduct).subscribe((data: any) => {

      if (data.modifiedCount) {
        this.deleteProduct.next(true);
      }

    })
  }

  removeWishlist (index: any) {
    return this.http.post(this.backendUrls.URLs.removeWishlist, index);
    
  }

  showWishlistedProducts(wishlist: string){
    const body = {
      wishlistName : wishlist
    }
    return this.http.post(this.backendUrls.URLs.showProducts, body);
  }


}
