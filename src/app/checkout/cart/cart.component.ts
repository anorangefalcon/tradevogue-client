import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private cookie: CookieService) { }
  cartArr: any[] = [];
  userToken: any = this.cookie.get("userToken");

  ngOnInit() {
    this.cartService.fetchCart("details").subscribe((data) => {
      this.cartArr = data;

      this.cartArr = this.cartArr?.map((item: any) => {
        item.image = (item.assets).find((asset: any) => {
          return (asset.color) === item.color;
        }).photo[0];

        return item;
      });
    });
  }

  remove_item(identifier: any) {
    this.cartService.removeItem(identifier);
  }

  changeQuantity(what: string, productIndex: any, selectedQuantity: Number) {

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

    let cartItem = {
      index: productIndex,
      quantity: this.cartArr[productIndex].info.quantity
    }

    if (this.userToken) {
      cartItem.index = this.cartArr[productIndex]._id;
    }

    this.cartService.updateCart(cartItem);
  }
}