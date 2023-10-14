import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { FetchDataService } from '../../services/fetch-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSearching: boolean = false;
  isUserLogin: boolean = false;
  hamburgerOpen: boolean = false;
  purchaser: any = "";
  cart_count: number = 0;
  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;

  constructor(private cartService: CartService, private cookie: CookieService, private fetchDataService: FetchDataService, private router: Router) {
    // const storedLoginDetails = this.cookie.get('userToken');
    // if (storedLoginDetails) {
    //   this.isUserLogin = true;
    //   const storedLoginDetailsObj = JSON.parse(storedLoginDetails);
    //   this.purchaser = storedLoginDetailsObj.username;
    // }
    const isUser = this.cookie.get("userToken")
    if (isUser) {
      this.isUserLogin = true;
    }



  }

  ngOnInit() {
    this.cartService.fetchCart().subscribe((data) => {

      this.cart_count = data.details.length;
      this.cartArr = data.details;

      this?.fetchDataService?.subject?.subscribe((val)=>{
        this.purchaser=val;
        console.log(this.purchaser, "purchaser")
        
       })
    })

    
  }

  onLogout() {
    this.cookie.delete('userToken');
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
