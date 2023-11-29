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

  constructor(
    private cartService: CartService, 
    private router: Router,
    private userService: LoginCheckService) {}

  cartArr: any[] = [];
  userToken: any = '';
  direction: any = 'right';
  loading: Boolean = false;
  
  ngOnInit() {
    
    this.userService.getUser('token').subscribe((token: any) => {
      this.userToken = token;
      this.loading = true;

      this.cartService.cartLoading.subscribe((data: any)=>{
        this.loading = data;
      })
      this.cartService.fetchCart("details").subscribe((data) => {
        this.cartArr = data;
        this.cartArr = this.cartArr?.map((item: any) => {
          item.image = (item.assets).find((asset: any) => {
            return (asset.color) === item.color;
          }).photo[0];

          this.updatingArr = [];
          return item;
        });
      });
    })
  }

  remove_item(identifier: any) {
    this.cartService.removeItem(identifier);
  }

  isDisabled(what: string, productIndex: any, selectedQuantity: Number) {

    let quantityIndex = this.cartArr[productIndex].info.orderQuantity.findIndex((q: any) => {
      return q == selectedQuantity;
    });

    const stockLimit = this.cartArr[productIndex].assets.find((asset: any) => {
      return asset.color === this.cartArr[productIndex].color;
    }).stockQuantity.find((stock: any) => {
      return stock.size === this.cartArr[productIndex].size;
    }).quantity;

    if (quantityIndex === -1) {
      for (let i = (this.cartArr[productIndex].info.orderQuantity.length - 1); i >= 0; i--) {        
        if (this.cartArr[productIndex].info.orderQuantity[i] < stockLimit) {
          quantityIndex = i + 1;
          break;
        }
      }
      if(this.cartArr[productIndex].info.orderQuantity[0] > stockLimit){
        quantityIndex = 0;
      }
    }

    if (what == 'next' && quantityIndex <= (this.cartArr[productIndex].info.orderQuantity.length - 1)) {
      if (this.cartArr[productIndex].info.orderQuantity[quantityIndex] >= stockLimit) {
        return true;
      }
      if ((quantityIndex >= ((this.cartArr[productIndex].info.orderQuantity.length) - 1)) || quantityIndex == -1) {
        return true;
      }
    }
    
    if (what == 'previous') {
      if (this.cartArr[productIndex].info.orderQuantity[quantityIndex] === stockLimit && stockLimit <= this.cartArr[productIndex].info.orderQuantity[0] && quantityIndex === -1) {
        return true;
      }
      if (quantityIndex == 0 || quantityIndex == -1) {
        return true;
      }
    }
    return false;
  }

  changeQuantity(what: string, productIndex: any, selectedQuantity: Number) {
    this.appendUpdateArr(productIndex);

    let quantityIndex = this.cartArr[productIndex].info.orderQuantity.findIndex((q: any) => {
      return q == selectedQuantity;
    });

    const stockLimit = this.cartArr[productIndex].assets.find((asset: any) => {
      return asset.color === this.cartArr[productIndex].color;
    }).stockQuantity.find((stock: any) => {
      return stock.size === this.cartArr[productIndex].size;
    }).quantity;

    if (quantityIndex === -1) {
      for (let i = (this.cartArr[productIndex].info.orderQuantity.length - 1); i >= 0; i--) {        
        if (this.cartArr[productIndex].info.orderQuantity[i] < stockLimit) {
          quantityIndex = i + 1;
          break;
        }
      }
      if(this.cartArr[productIndex].info.orderQuantity[0] > stockLimit){
        quantityIndex = 0;
      }
    }

    if (what === 'next' && quantityIndex <= (this.cartArr[productIndex].info.orderQuantity.length - 1)) {
      if (this.cartArr[productIndex].info.orderQuantity[quantityIndex + 1] <= stockLimit) {
        this.cartArr[productIndex].info.quantity = this.cartArr[productIndex].info.orderQuantity[quantityIndex + 1];
      }
      else {
        this.cartArr[productIndex].info.quantity = stockLimit;
        quantityIndex += 1;
      }
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

  closeSideCart(){
    this.cartService.sideCart.next(false);
  }

  updatingArr: Number[] = [];

  appendUpdateArr(index: any){
    this.updatingArr.push(index);
  }

  isUpdating(index: any){
    if(this.updatingArr.includes(index)){
      return true;
    }
    return false;
  }
}