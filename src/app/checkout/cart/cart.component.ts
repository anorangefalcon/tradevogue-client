import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  constructor(private cartService: CartService) { }
  cartArr: any[] = [];
  
  ngOnInit() {
    this.cartArr = this.cartService.fetchCart("details");
  }

  remove_item(sku: any) {
    this.cartService.removeItem(sku);
    this.cartArr = this.cartService.fetchCart("details");
  }
}



