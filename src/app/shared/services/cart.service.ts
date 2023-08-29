import { EventEmitter, Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private fetchData: FetchDataService) {
    this.fetchDetails();
  }

  // reinitializeData = new EventEmitter<boolean>();

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

    this.fetchDetails();
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

  fetchDetails() {
    const fields = ["name", "price", "oldPrice", "image"];
    const localCart = localStorage.getItem("myCart");


    this.cart.details = localCart ? JSON.parse(localCart) : null;

    if (this.cart.details !== null) {

      this.fetchData.getData().subscribe((data) => {

        for (let i = 0; i < this.cart.details.length; i++) {

          const matchSku = (data.find((item: any) => {
            return item.sku == this.cart.details[i].sku;
          }));

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

          this.cart.amounts.total = this.cart.amounts.subTotal + this.cart.amounts.shipping;
          this.cart.amounts.savings += (this.cart.details[i].oldPrice * this.cart.details[i].Quantity);
        }
        this.cart.amounts.savings -= this.cart.amounts.total;
      })

    }
  }

  fetchCart(what: string = '') {

    if (what === 'details') {
      return this.cart.details;
    }
    else if (what === ('amounts' || 'amount')) {
      return this.cart.amounts;
    }

    return this.cart;
  }

  removeItem(sku: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      this.cartStorage = this.cartStorage.filter((item)=>{
        return item.sku !== sku;
      });
    }

    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
    this.fetchDetails();
  }

  // fixData(){
  //   this.reinitializeData.emit(true);
  // }
}
