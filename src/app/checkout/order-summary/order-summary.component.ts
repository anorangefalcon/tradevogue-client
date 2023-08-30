import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  updateBoolean: boolean = false;
  cart: any = {};

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.fetchCart().subscribe((data)=>{
      this.cart = data;
    });
  } 

}


