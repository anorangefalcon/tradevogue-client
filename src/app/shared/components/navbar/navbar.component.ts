import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cart_count: number = 0;
  cartArr: any[] = [];
  navbar_scroll_style: boolean = false;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.fetchCart().subscribe((data) => {
      this.cart_count = data.details.length;
      this.cartArr = data.details;
    })
  }

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 40) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }

}
