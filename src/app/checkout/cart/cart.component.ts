import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartArr: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartArr = this.cartService.fetchCart("details");
   }
}



