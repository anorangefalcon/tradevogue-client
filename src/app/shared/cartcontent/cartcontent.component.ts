import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartcontent',
  templateUrl: './cartcontent.component.html',
  styleUrls: ['./cartcontent.component.css']
})
export class CartcontentComponent implements OnInit {

  constructor(private cartService: CartService, private cookie: CookieService, private route: Router, private el: ElementRef) { }
  cartArr: any[] = [];
  cartCount: number = 0;

  navbar_scroll_style: boolean = false;


  updateBoolean: boolean = false;
  cart: any = {};

  ngOnInit() {
    this.cartService.fetchCart("details").subscribe((data) => {
      this.cartArr = data;
    });
    this.cartService.fetchCart("count").subscribe((data) => {
      this.cartCount = data;
    });
    this.cartService.fetchCart().subscribe((data) => {
     
      this.cart = data;
    });
  }

  remove_item(sku: any) {
    this.cartService.removeItem(sku);
  }

  changeQuantity(what: string, sku: string, selectedQuantity: number) {    

    const productIndex = this.cartArr.findIndex((item: any) => {
      return item.sku === sku;
    });

    const quantityIndex = this.cartArr[productIndex].orderQuantity.findIndex((q: any) => {
      return q == selectedQuantity;
    });
    
    if (what === 'next' && quantityIndex < (this.cartArr[productIndex].orderQuantity.length - 1)) {
      this.cartArr[productIndex].Quantity = this.cartArr[productIndex].orderQuantity[quantityIndex + 1];
    }
    else if (what === 'previous' && quantityIndex > 0){
      this.cartArr[productIndex].Quantity = this.cartArr[productIndex].orderQuantity[quantityIndex - 1];
    }
    else{
      return;
    }

    const cartItem = {
      sku: this.cartArr[productIndex].sku,
      size: this.cartArr[productIndex].size,
      color: this.cartArr[productIndex].color,
      quantity: this.cartArr[productIndex].Quantity
    }

    this.cartService.updateCart(cartItem);
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



