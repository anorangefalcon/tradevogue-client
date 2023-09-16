import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService) { }
  cartArr: any[] = [];

  ngOnInit() {
    this.cartService.fetchCart("details").subscribe((data) => {
    
    console.log("inside subscirbe");
      this.cartArr = data;
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
}



