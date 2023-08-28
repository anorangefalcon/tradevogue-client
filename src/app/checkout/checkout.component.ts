import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  navbar_scroll_style: boolean = false;
  cartCount: number = 0;

  ngOnInit() {
    const localCart = localStorage.getItem("myCart");
    const localCartArr = localCart ? JSON.parse(localCart) : null;
    this.cartCount = localCartArr.length;
  }

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }
}
