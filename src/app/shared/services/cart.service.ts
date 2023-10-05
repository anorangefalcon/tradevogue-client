import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private fetchData: FetchDataService, private toastService: ToastService) {
    this.fetchDetails();
  }

  // used to add items to cart in localStorage
  cartStorage: any[] = [];
  // used as a subject for cart to be as observable
  cartSubject = new BehaviorSubject<any>({});
  // actual data lies here
  cart$ = this.cartSubject.asObservable();

  addToCart(data: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      const skuFound = this.cartStorage.find((item: any) => {
        return item.sku === data.sku;
      });
      if (skuFound) {
        this.toastService.errorToast({
          title: 'Item already exists in cart'
        })
        return;
      }
    }

    this.cartStorage.push({ "sku": data.sku, "size": data.size, "color": data.color, "Quantity": data.quantity });
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
    this.toastService.successToast();

    this.fetchDetails();
  }


  // could be more optimised but cant due to cap Q in quantity
  updateCart(data: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      const skuFound = this.cartStorage.find((item: any) => {
        return item.sku === data.sku;
      });
      if (skuFound) {
        skuFound.size = data.size;
        skuFound.color = data.color;
        skuFound.Quantity = data.quantity;
      }
    }

    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);

    this.fetchDetails();
  }


  fetchDetails() {
    const cartDetails: any = {
      details: [],
      amounts: {
        subTotal: 0,
        shipping: 0,
        savings: 0,
        total: 0
      }
    }
    const fields = ["name", "price", "oldPrice", "image", "orderQuantity"];
    const localCart = localStorage.getItem("myCart");
    cartDetails.details = localCart ? JSON.parse(localCart) : null;

    if (cartDetails.details !== null) {
      this.fetchData.getData().subscribe((data) => {

        for (let i = 0; i < cartDetails.details.length; i++) {
          const matchSku = (data.find((item: any) => {
            return item.sku == cartDetails.details[i].sku;
          }));
          Object.assign(cartDetails.details[i],
            Object.fromEntries(
              fields.map(field => [
                field, matchSku[field]
              ])
            )
          );


          // { temp until we connect db
          if (!(cartDetails.details[i].color)) {
            cartDetails.details[i].color = (matchSku['colors'])[0]
          }
          if (!(cartDetails.details[i].price)) {
            cartDetails.details[i].price = (matchSku['price'])[0]
          }
          if (!(cartDetails.details[i].Quantity)) {
            cartDetails.details[i].Quantity = (matchSku['orderQuantity'])[0]
          }
          if (!(cartDetails.details[i].size)) {
            cartDetails.details[i].size = (matchSku['sizes'])[0]
          }
          // }

          //amounting payment:
          cartDetails.amounts.subTotal += (cartDetails.details[i].price * cartDetails.details[i].Quantity);

          cartDetails.amounts.shipping += 50;

          cartDetails.amounts.savings += cartDetails.details[i].oldPrice * cartDetails.details[i].Quantity;  
        }
        
        cartDetails.amounts.savings -= cartDetails.amounts.subTotal;
        cartDetails.amounts.savings = (Math.round((cartDetails.amounts.savings) * 100))/100;

        cartDetails.amounts.subTotal = (Math.round((cartDetails.amounts.subTotal) * 100)/100);
        
        cartDetails.amounts.total = cartDetails.amounts.subTotal + cartDetails.amounts.shipping;

      })

      this.cartSubject.next(cartDetails);
    }
  }

  removeItem(sku: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      this.cartStorage = this.cartStorage.filter((item) => {
        return item.sku !== sku;
      });
    }

    this.toastService.notificationToast({
      title: 'Item removed!'
    })
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
    this.fetchDetails();
  }

  fetchCart(what: string = ''): Observable<any> {

    if (what === 'count') {
      return this.cart$.pipe(
        map(data => data.details.length)
      );
    }
    else if (what === 'details') {
      return this.cart$.pipe(
        map(data => data.details)
      );
    }
    else if (what === ('amount' || 'amounts')) {
      return this.cart$.pipe(
        map(data => data.amounts)
      );
    }
    return this.cart$;
  }

}
