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
      return selectedQuantity == q;
    });


    if (what === 'next') {
      this.cartArr[productIndex].Quantity = this.cartArr[productIndex].orderQuantity[quantityIndex + 1];
    }
    else if (what === 'previous'){
      this.cartArr[productIndex].Quantity = this.cartArr[productIndex].orderQuantity[quantityIndex - 1];
    }

  }
}



