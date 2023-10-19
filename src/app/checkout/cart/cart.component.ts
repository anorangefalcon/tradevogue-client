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

      this.cartArr = this.cartArr.map((item: any) => {
        item.image = (item.assets).find((asset: any) => {
          return (asset.color) === item.color;
        }).photo[0];
        return item;
      });
    });
  }

  remove_item(sku: any) {
    this.cartService.removeItem(sku);
  }

  changeQuantity(what: string, sku: string, selectedQuantity: number) {

    const productIndex = this.cartArr.findIndex((item: any) => {
      return item.sku === sku;
    });

    const quantityIndex = this.cartArr[productIndex].info.orderQuantity.findIndex((q: any) => {
      return q == selectedQuantity;
    });

    const stockLimit = this.cartArr[productIndex].assets.find((asset: any) => {
      return asset.color === this.cartArr[productIndex].color;
    }).stockQuantity.find((stock: any) => {
      return stock.size === this.cartArr[productIndex].size;
    }).quantity;

    if (what === 'next' && quantityIndex < (this.cartArr[productIndex].info.orderQuantity.length - 1) && (this.cartArr[productIndex].info.orderQuantity[quantityIndex + 1] <= stockLimit)) {
      this.cartArr[productIndex].info.quantity = this.cartArr[productIndex].info.orderQuantity[quantityIndex + 1];
    }
    else if (what === 'previous' && quantityIndex > 0) {
      this.cartArr[productIndex].info.quantity = this.cartArr[productIndex].info.orderQuantity[quantityIndex - 1];
    }
    else {
      return;
    }

    const cartItem = {
      sku: this.cartArr[productIndex].sku,
      quantity: this.cartArr[productIndex].info.quantity
    }

    this.cartService.updateCart(cartItem);
  }
}



