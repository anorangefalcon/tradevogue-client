import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private router: Router,
    private userService: LoginCheckService) { }

  nextDisabledBtn: Boolean = false;
  PreviousDisabledBtn: Boolean = false;
  cartArr: any[] = [];
  userToken: any = '';
  direction: any = 'right';

  ngOnInit() {
    this.userService.getUser('token').subscribe((token: any) => {
      this.userToken = token;

      this.cartService.fetchCart("details").subscribe((data) => {
        this.cartArr = data;
        this.cartArr = this.cartArr?.map((item: any) => {
          item.image = (item.assets).find((asset: any) => {
            return (asset.color) === item.color;
          }).photo[0];

          return item;
        });
      });
    })
  }

  remove_item(identifier: any) {
    this.cartService.removeItem(identifier);
  }



  changeQuantity(what: string, productIndex: any, selectedQuantity: Number) {
    console.log('quantity runs ');

    const quantityIndex = this.cartArr[productIndex].info.orderQuantity.findIndex((q: any) => {
      return q == selectedQuantity;
    });

    if (what == 'next') {
      if ((quantityIndex >= ((this.cartArr[productIndex].info.orderQuantity.length) - 1)) || quantityIndex == -1) {
        this.nextDisabledBtn = true;
        this.PreviousDisabledBtn = false;
        return;
      }
    }

    if (what == 'previous') {
      if (quantityIndex == 0 || quantityIndex == -1) {
        this.PreviousDisabledBtn = true;
      }
      this.nextDisabledBtn = false;
    }



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

  async ProceedCheckOut() {
    if (!this.userToken) {
      this.router.navigate(['/auth/login']);
    }
    this.cartService.fetchCart().subscribe(() => { });
  }
}