import { Component, Output } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {


  cart: any = {};
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart = this.cartService.fetchCart();
    console.log(this.cart);
  }
  // ngOnInit() {

  //   // console.log(this.productArr, "arrrey");
  //   // // const x=Object.keys(this.productArr[0]);
  //   // // console.log("x is ",x);

  //   // console.log(this.productArr[0].extra, "extra");
  //   // for (let i = 0; i < this.productArr.length; i++) {

  //   //   console.log(this.productArr[i].extra?.price, "price");


  //   //   this.subTotal += this.productArr[i].extra.price * this.productArr[i].Quantity;
  //   //   this.oldPrice += this.productArr[i].extra.oldPrice * this.productArr[i].Quantity;

  //   //   this.savings = this.oldPrice - this.subTotal;

  //   //   this.shipping += 50;
  //   // }
  //   // this.total = this.subTotal + this.shipping;
  //   // console.log(this.total, "totttt");
  // }


}


