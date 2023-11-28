import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { LoginCheckService } from '../../services/login-check.service';
import { CheckoutService } from 'src/app/checkout/checkout.service';

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
  isLogin: boolean = false;
  darkTheme : boolean = false;

  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;
  shadowed: boolean = true;
  categories: any = {
    men: [],
    women: []
  }
  secureNavbar: boolean=false;

  UserRole!:String
  
  constructor(private cartService: CartService, private userService: LoginCheckService, private checkOutService:CheckoutService, private BackendEndUrl: UtilsModule, private fetchDataService: FetchDataService, private router: Router, private wishlistService: WishlistService) {

    this.checkOutService.secureNavbar$.subscribe((data)=>{
      this.secureNavbar = data;
    });

    this.userService.getUser('token').subscribe((data)=>{
      if(!data) return;
      this.fetchDataService.HTTPGET(this.BackendEndUrl.URLs.authorizeUrl).subscribe((data:any)=>{
        if(data=='admin') this.UserRole=data;
      })
    })

    this.userService.getUser('name').subscribe((name: any) => {
      if (name) {
        this.purchaser = name;
      }
      else{
        this.purchaser = '';
      }
    });
  }

  ngOnInit() {
    if (this.userService.getUser().subscribe((data) => {
      this.isUserLogin = data;
    }))

      this.cartService.fetchCart('count').subscribe((item_count: any) => {
        this.cart_count = item_count;
      })

    // this.wishlistService.getWishlistCount();
    this.wishlistService.WishlistCount$.subscribe((data) => {
      if (data || data==0) {
        this.wishlistCount = data;
      }
    })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/' || this.router.url === '') {
          this.shadowed = true;
        }
        else {
          this.shadowed = true;
        }
      }
    })

    const body = {
      parameter: "mix"
    }

    this.fetchDataService.HTTPPOST(this.BackendEndUrl.URLs.uniqueProductFields, body).subscribe((data: any) => {
      this.categories.men = data.data.male.category;
      this.categories.women = data.data.female.category;        
    })

  }

  searchExplore(query: string) {
    if(query == ''){
      this.router.navigateByUrl(`/explore`);
    }
    else{
      this.router.navigateByUrl(`/explore?search=${query}`);
    }
  }

  onLogout() {
    this.userService.logoutUser();
  }


  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 40) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }

  toggleTheme(){
    // document.getElementById('tv-body').
    this.darkTheme = !this.darkTheme
    this.fetchDataService.theme.next(this.darkTheme)
    $('#tv-body').toggleClass("dark")
  }




}
