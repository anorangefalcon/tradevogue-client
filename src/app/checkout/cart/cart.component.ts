import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/shared/services/cart.service';
import { BillingResponseService } from '../billing-response.service';
import { LoginCheckService } from 'src/app/shared/services/login-check.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private loginCheckService:LoginCheckService,private LoginCheckService:LoginCheckService, private cookie: CookieService, private billingService:BillingResponseService, private router:Router) {
    // this.userService.PaymentUrlVisited.next(false);
    // this.billingService.BillingPageVisited.next(false);
   }
  cartArr: any[] = [];
  userToken: any = this.cookie.get("userToken");
  direction:any='right';
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

  async ProceedCheckOut(){
    // const checkToken=this.cookie.get('userToken');
    const checkToken=this.LoginCheckService.getUser().subscribe((checkToken:any)=>{
      if(!checkToken){
        this.router.navigate(['/auth/login']);
      }
      this.cartService.fetchCart().subscribe((data)=>{
   
      })
    })

  
  }
}