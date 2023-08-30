import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  navbar_scroll_style: boolean = false;
  cartCount: number = 0;

  constructor (private cartService: CartService){}

  ngOnInit() {
    this.cartService.fetchCart("count").subscribe((data)=>{
      this.cartCount = data;
    });
  }

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }
}
