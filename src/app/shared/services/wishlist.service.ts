import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserServiceService } from './user-service.service';
import { productData } from '../productData';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  showWishlistsSlider = new BehaviorSubject<any>('');
  display$ = this.showWishlistsSlider.asObservable();

  showWishlistPopup = new BehaviorSubject<any>('');
  wishlistPopupData = this.showWishlistPopup.asObservable();

  // sendWishlists = new BehaviorSubject<any>('');
  // send$ = this.sendWishlists.asObservable();
  // WishlistOpened: any = false;

  constructor(private cookie: CookieService,
    private fetchService: FetchDataService,
    private backendUrls: UtilsModule,
    private userService: UserServiceService,
    private router: Router,
    private fetchDataService: FetchDataService,
    private utils: UtilsModule,
    private http: HttpClient,
    private toastService: ToastService

  ) { }

  chooseWishlist(productData: any = '') {

    const IsLogin = this.cookie.get('userToken')

    if(IsLogin){
      this.fetchDataService.HTTPGET(this.backendUrls.URLs.showWishlist).subscribe((data: any)=>{
        this.showWishlistPopup.next(data);
      });
    }
    else {

      this.router.navigate(['/auth/login']);
    }

    return;
    // let data: any = await this.fetchService.httpGet(this.backendUrls.URLs.showWishlist);
    // return this.http.get(this.backendUrls.URLs.showWishlist);
      
    
    // .subscribe((data)=>{
    //   this.showWishlistsSlider.next({data, productData});
    // });
    
  }

  addToWishList(){
    
  }

  // async addToWishlist(item : string,productId:string){
  //   let body:any={wishlistName:item,productId};


  //   let data: any = await this.fetchDataService.httpPost(this.utils.URLs.addToWishlist, body)
  //   const toastMessage = { title: data.message };
  //   this.toastService.notificationToast(toastMessage);
  //   console.log(data, "hua add wishlist mein?");


  //   // let newCount = await this.fetchDataService.ht  tpGet(this.utils.URLs.showWishlistCount)
  //   // await this.UserService.emittingValue('wishlistCount', newCount);

  //   // console.log(newCount, "neww counttt");
  //   // this.showTextField = false;

  //   // this.show = false
  //   // console.log("end");


  // }
}
