import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private fetchData: FetchDataService) { }

  // used to add items to cart in localStorage
  cartStorage: any[] = [];
  addToCart(data: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      const skuFound = this.cartStorage.find((item: any) => {
        return item.sku == data.sku;
      });
      if (skuFound) {
        return;
      }
    }

    this.cartStorage.push({ "sku": data.sku, "size": data.size, "color": data.color, "Quantity": data.quantity });
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
  }


  cart: any = {
    details: [],
    amounts: {
      subTotal: 0,
      shipping: 0,
      savings: 0,
      total: 0
    }
  };
  fetchCart(what: string = '') {
    const fields = ["name", "price", "oldPrice", "image"];
    const localCart = localStorage.getItem("myCart");

    this.cart.details = localCart ? JSON.parse(localCart) : null;

    this.fetchData.getData().subscribe((data) => {
      console.log(this.cart.details.length, "hi");

      for (let i = 0; i < this.cart.details.length; i++) {

        const matchSku = (data.find((item: any) => {
          return item.sku == this.cart.details[i].sku;
        }));

        console.log("match sku is ",matchSku);
        
        Object.assign(this.cart.details[i],
          Object.fromEntries(
            fields.map(field => [
              field, matchSku[field]
            ])
          )
        );

        //amounting payment:        
        this.cart.amounts.subTotal += (this.cart.details[i].price * this.cart.details[i].Quantity);
        this.cart.amounts.shipping += 50;
        console.log(this.cart.amounts.shipping);

        this.cart.amounts.total = this.cart.amounts.subTotal + this.cart.amounts.shipping;
        this.cart.amounts.savings += (this.cart.details[i].oldPrice * this.cart.details[i].Quantity);
      }
      this.cart.amounts.savings -= this.cart.amounts.total;

      
    })

    if (what === 'details') {
      return this.cart.details;
    }
    else if (what === ('amounts' || 'amount')) {
      return this.cart.amounts;
    }

    return this.cart;
  }

}
