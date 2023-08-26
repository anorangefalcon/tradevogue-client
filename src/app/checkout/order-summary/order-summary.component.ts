import { Component, Output } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  

  cart: any = {};
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {  
    this.cart = this.cartService.fetchCart(); 
    console.log(this.cart);
       
  }


}


