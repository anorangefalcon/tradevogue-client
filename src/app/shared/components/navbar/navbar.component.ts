import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from '../../services/fetch-data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  purchaser: any = 'User';
  cart_count: number = 0;

  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;
  shadowed: boolean = false;
  categories: any = {
    men: [],
    women: []
  }

  constructor(private cartService: CartService, private cookie: CookieService, private fetchDataService: FetchDataService, private router: Router) { }

  ngOnInit() {

    this.purchaser = this.cookie.get('userName');
    const isUser = this.cookie.get("userToken")
    if (isUser) {
      this.isUserLogin = true;
    }

    this.cartService.fetchCart('count').subscribe((item_count: any) => {
      this.cart_count = item_count;
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
    // console.log("hi"
    // );

    this.fetchDataService.getUniqueProductFields(body).subscribe((data: any) => {
      console.log(data, "uniqe data navbar");

      // this.categories.men = data.data.male.category;
      // this.categories.women = data.data.female.category;
      // console.log(this.categories);

    })

  }

  onLogout() {
    this.cookie.delete('userToken');
    this.cookie.delete('userName');


    // doSignout();
    this.router.navigate(['/']);
    this.isUserLogin = false;
  }

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 40) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }

}
