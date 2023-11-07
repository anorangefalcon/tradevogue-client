import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from '../../../faq-page/fetch-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { LoginCheckService } from '../../services/login-check.service';

// declare var doSignout:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isSearching: boolean = false;
  isUserLogin: boolean = false;
  hamburgerOpen: boolean = false;
  purchaser: any = '';
  cart_count: number = 0;
  wishlistCount: number = 0;
  isLogin : boolean = false;

  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;
  shadowed: boolean = false;
  categories: any = {
    men: [],
    women: []
  }

  constructor(private cartService: CartService, private checkLogin: LoginCheckService, private cookie: CookieService, private fetchDataService: FetchDataService, private router: Router, private wishlistService: WishlistService, private utils: UtilsModule) {
    let userName = this.cookie.get('userName')
    if (userName) {
    
      this.purchaser = userName;
    }

   

  }

  async ngOnInit() {
    if (this.checkLogin.loginCheckObservable$.subscribe((data) => {
      this.isUserLogin = data;
    }))

      this.cartService.fetchCart('count').subscribe((item_count: any) => {
        this.cart_count = item_count;
      })

    this.wishlistService.getWishlistCount();


    this.wishlistService.WishlistCount$.subscribe((data) => {
      if (data) {
        this.wishlistCount = data;
      }
    })






    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/' || this.router.url === '') {
          this.shadowed = false;
        }
        else {
          this.shadowed = true;
        }
      }
    })

    const body = {
      parameter: "mix"
    }

    this.fetchDataService.getUniqueProductFields(body).subscribe((data: any) => {
      // console.log(data, "navbar data");
    })

  }

  searchExplore(query: string) {
    this.router.navigateByUrl(`/explore?search=${query}`);
  }

 
  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 40) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }


onLogout() {

  this.cookie.delete('userToken');
  this.cookie.delete('userName');
  this.router.navigate(['/']);
  this.isUserLogin = false;
}

}
