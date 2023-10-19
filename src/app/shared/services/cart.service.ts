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

    this.cartStorage.push({ "sku": data.sku, "size": data.size, "color": data.color, "quantity": data.quantity });
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
    this.toastService.successToast();

    this.fetchDetails();
  }


  updateCart(data: any) {
    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);

      const skuFound = this.cartStorage.find((item: any) => {
        return item.sku === data.sku;
      });
      delete data.sku;

      if (skuFound) {
        Object.keys(data).forEach((key:any) => {
          skuFound[key] = data[key];
        });
      }
    }

    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);

    this.fetchDetails();
  }

  fetchDetails() {
    const localCart = localStorage.getItem('myCart');
    let cartDetails = localCart ? JSON.parse(localCart) : null;

    this.fetchData.getCartData(cartDetails).subscribe((data: any) => {      
      this.cartSubject.next(data);
    });
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
        map(data => data.details?.length)
      );
    }
    else if (what === 'details') {
      return this.cart$.pipe(
        map(data => data?.details)
      );
    }
    else if (what === ('amount' || 'amounts')) {
      return this.cart$.pipe(
        map(data => data?.amounts)
      );
    }
    return this.cart$;
  }

}
