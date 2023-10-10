import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { CartService } from '../shared/services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  navbar_scroll_style: boolean = false;
  cartCount: number = 0;

  updateBoolean: boolean = false;
  cart: any = {};

  constructor(private cartService: CartService, private cookie: CookieService, private route: Router, private el: ElementRef) { }

  ngOnInit() {
    this.cartService.fetchCart("count").subscribe((data) => {
      this.cartCount = data;
    });
    this.cartService.fetchCart().subscribe((data) => {
     
      this.cart = data;
    });
  }

  redirectToLogin() {
    const returnUrl = '/cart/billing';
    this.route.navigate(['/auth/login'], { queryParams: { returnUrl } });
  }

  scrollToOrders() {
    const orders = this.el.nativeElement.querySelector('#orders')
    if (orders) {
      orders.scrollIntoView(
        {
          block: 'start',
          behavior: 'smooth'
        });
    }
  }
  checkLogin() {
    const cookieExists = document.cookie.indexOf('loginDetails') !== -1;
    console.log(cookieExists);

    // cookieExists == true ? this.updateBoolean = false : this.updateBoolean = true;

    if (!cookieExists) {
      this.redirectToLogin();
    } else {
      
      this.route.navigate(['/cart/billing']).then(() => {

      
        console.log("CART IS  ",this.cart)
        window.location.reload();
      });
  }
}

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }
}
