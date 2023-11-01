import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { UtilsModule } from './../../utils/utils.module';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private fetchData: FetchDataService, private toastService: ToastService, private cookie: CookieService, private http: HttpClient, private backendUrls: UtilsModule) {
    this.fetchDetails();
  }

  // used to add items to cart in localStorage
  cartStorage: any[] = [];
  sideCart = new BehaviorSubject<any>('');
  // used as a subject for cart to be as observable
  private cartSubject = new BehaviorSubject<any>({});
  // actual data lies here
  private cart$ = this.cartSubject.asObservable();

  addToCart(data: any) {
    console.log('addto cart clicked ',data);
    
    const cartObj = { "sku": data.sku, "size": data.size, "color": data.color, "quantity": data.quantity };
    const userToken = this.cookie.get("userToken");

    if (userToken) {
      this.addToCartWithToken(cartObj);
    } else {
      this.addToCartWithoutToken(cartObj);
    }
  }

  private addToCartWithToken(cartObj: any) {
    this.http.post(this.backendUrls.URLs.addItemsToCart, [cartObj]).subscribe(
      (details: any) => {
        if (!details.added) {
          this.toastService.warningToast({ title: 'Item already exists in cart' });
        } else {
          this.handleSuccessfulAddToCart();
        }
      }
    );
  }

  private addToCartWithoutToken(cartObj: any) {
    const localStorageData = localStorage.getItem("myCart");
    this.cartStorage = localStorageData ? JSON.parse(localStorageData) : [];

    if (this.checkIfSameConfigAlreadyExists(this.cartStorage, cartObj)) {
      this.cartStorage.push(cartObj);
      localStorage.setItem("myCart", JSON.stringify(this.cartStorage));
      this.handleSuccessfulAddToCart();
    } else {
      this.toastService.warningToast({ title: 'Item already exists in cart' });
    }
  }

  private handleSuccessfulAddToCart() {
    this.toastService.successToast();
    this.sideCart.next(true);
    this.fetchDetails();
  }

  // Helper function
  private checkIfSameConfigAlreadyExists(existingCart: any, newItem: any): boolean {
    const shouldAdd = !existingCart.some((existingItem: any) =>
      newItem.sku === existingItem.sku &&
      newItem.color === existingItem.color &&
      newItem.size === existingItem.size
    );

    return shouldAdd;
  }


  updateCart(data: any) {

    const userToken = this.cookie.get("userToken");
    if (userToken) {
      this.http.post(this.backendUrls.URLs.updateItemFromCart, data).subscribe((data: any) => {
        if (data.updated) {
          this.fetchDetails();
        }
      });
    }
    else {
      const localStorageData = localStorage.getItem("myCart");

      if (localStorageData) {
        this.cartStorage = JSON.parse(localStorageData);

        const itemFound = this.cartStorage[data.index];
        delete data.index;

        if (itemFound) {
          Object.keys(data).forEach((key: any) => {
            itemFound[key] = data[key];
          });
        }
      }

      const myCart = JSON.stringify(this.cartStorage);
      localStorage.setItem("myCart", myCart);


      this.fetchDetails();
    }

  }

  fetchDetails() {
    const localCart = localStorage.getItem('myCart');
    let cartDetails = localCart ? JSON.parse(localCart) : null;

    const userToken = this.cookie.get("userToken");
    if (localCart && userToken) {
      this.http.post(this.backendUrls.URLs.addItemsToCart, cartDetails).subscribe((message: any) => {
        this.clearCart('localOnly');

        this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
          this.cartSubject?.next(data);
        });
      });
    }
    else {
      if (!cartDetails) {
        cartDetails = [];
      }
      this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
        this.cartSubject?.next(data);
      });
    }
  }

  removeItem(identifier: any) {

    const userToken = this.cookie.get("userToken");
    if (userToken) {
      this.http.post(this.backendUrls.URLs.removeItemFromCart, { itemId: identifier }).subscribe((message: any) => {
        console.log(message);
        // this.ItemDeleted=true;
        this.fetchDetails();
      });
    }
    else {
      const localStorageData = localStorage.getItem("myCart");

      if (localStorageData) {
        this.cartStorage = JSON.parse(localStorageData);
        console.log(identifier, this.cartStorage);

        this.cartStorage.splice(identifier, 1);
      }

      const myCart = JSON.stringify(this.cartStorage);
      localStorage.setItem("myCart", myCart);
      this.fetchDetails();
    }
    this.toastService.notificationToast({
      title: 'Item removed!'
    })

  }

  refreshCart() {

  }

  // use this function to access cart data
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

  clearCart(which: string = '') {

    if (!which) {
      const userToken = this.cookie.get("userToken");
      if (userToken) {
        this.http.get(this.backendUrls.URLs.clearCart).subscribe((message: any) => {
          console.log(message);
        });
      }
    }
    localStorage.removeItem("myCart");
  }

}
