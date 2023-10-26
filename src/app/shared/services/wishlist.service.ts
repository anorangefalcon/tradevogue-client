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
  WishlistOpened:any=false;

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

        
        this.sendWishlists.next(data);
        this.showWishlistsDialog.next(true);
        console.log('emitted -----');
        
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
