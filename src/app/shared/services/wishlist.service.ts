import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  showWishlistsDialog = new BehaviorSubject<boolean>(false);
  display$ = this.showWishlistsDialog.asObservable();
  
  sendWishlists = new BehaviorSubject<any>('');
  send$ = this.sendWishlists.asObservable();

  constructor(private cookie: CookieService,
    private fetchService: FetchDataService,
    private backendUrls: UtilsModule,
    private router : Router
  ) {}

  async showWishlist() {
    try {
      const IsLogin = this.cookie.get('userToken')

      if (IsLogin){
        let data: any = await this.fetchService.httpGet(this.backendUrls.URLs.showWishlist)
        // console.log(data, "data in wishlist service");
        // console.log('data is ',data);
        
        this.sendWishlists.next(data);
        this.showWishlistsDialog.next(true);
      }
      else {
        this.router.navigate(['auth/login'])

      }
    }
    catch (error) {
      console.log(error, "errrr");
    }
  }
}
