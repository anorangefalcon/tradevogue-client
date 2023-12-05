import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { UtilsModule } from './../../utils/utils.module';
import { LoginCheckService } from './login-check.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  user: boolean = false;
  // used to add items to cart in localStorage
  cartStorage: any[] = [];
  sideCart = new BehaviorSubject<any>('');
  // used as a subject for cart to be as observable
  private cartSubject = new BehaviorSubject<any>([]);
  // actual data lies here
  private cart$ = this.cartSubject.asObservable();

  cartLoading = new BehaviorSubject<Boolean>(false);
  allSubscriptions: Subscription[] = [];

  constructor(private toastService: ToastService, private http: HttpClient, private backendUrls: UtilsModule, private loginCheckService: LoginCheckService) {
    this.allSubscriptions.push(
      this.loginCheckService.getUser().subscribe((loggedIn: any) => {
        this.user = loggedIn;
        this.cartLoading.next(true);
        this.fetchDetails();
      }));
  }

  addToCart(cartItem: any, insertDefaults: Boolean = true) {
    this.cartLoading.next(true);
    this.sideCart.next(true);
    let cartObj;

    if (insertDefaults) {
      let assetIndex = cartItem.matchedIndex ? cartItem.matchedIndex : 0;
      let sizeIndex = 0;

      if (cartItem.assets[assetIndex].stockQuantity[0].quantity <= 0) {
        const ifMatchesSize = (cartItem.assets[assetIndex].stockQuantity).some((stockQ: any) => {
          if (stockQ.quantity > 0) return true;
          sizeIndex++;
          return false;
        });

        if (!ifMatchesSize) sizeIndex = 0;
      }

      const outOfStock = (cartItem.assets[assetIndex].stockQuantity[sizeIndex].quantity <= 0) ? true : false;
      if (outOfStock) {
        this.toastService.errorToast({
          title: "This Product is out of stock"
        });
        this.sideCart.next(false);
        this.cartLoading.next(false);
        return;
      }

      let limit = cartItem.assets[assetIndex].stockQuantity[sizeIndex].quantity;
      let arr = cartItem.info.orderQuantity;
      let filteredArray = arr.filter((item: any) => item <= limit);

      if (!(filteredArray.includes(limit)) && (arr[arr.length - 1] > limit)) {
        filteredArray.push(limit);
      }
      cartItem.info.orderQuantity = filteredArray;

      cartObj = {
        sku: cartItem.sku,
        color: cartItem.assets[assetIndex].color,
        size: cartItem.assets[assetIndex].stockQuantity[sizeIndex].size,
        quantity: cartItem.info.orderQuantity[0]
      }
    }
    else {
      cartObj = {
        sku: cartItem.data.sku,
        size: cartItem.size,
        color: cartItem.color,
        "quantity": cartItem.quantity
      };
    }

    if (this.user) {
      this.addToCartWithToken(cartObj);
    }
    else {
      this.addToCartWithoutToken(cartObj);
    }
  }

  private addToCartWithToken(cartObj: any) {
    this.allSubscriptions.push(
    this.http.post(this.backendUrls.URLs.addItemsToCart, [cartObj]).subscribe(
      (details: any) => {
        if (!details.added) {
          this.toastService.warningToast({ title: 'Already exists in cart add different variant' });
          this.cartLoading.next(false);
        }
        else {
          this.handleSuccessfulAddToCart();
        }
      }
    ));
  }

  private addToCartWithoutToken(cartObj: any) {
    const localStorageData = localStorage.getItem("myCart");
    this.cartStorage = localStorageData ? JSON.parse(localStorageData) : [];

    if (this.checkIfSameConfigAlreadyExists(this.cartStorage, cartObj)) {
      this.cartStorage.push(cartObj);
      localStorage.setItem("myCart", JSON.stringify(this.cartStorage));
      this.handleSuccessfulAddToCart();
    }
    else {
      this.toastService.warningToast({ title: 'Already exists in cart add different variant' });
      this.cartLoading.next(false);
    }
  }

  private handleSuccessfulAddToCart() {
    this.fetchDetails();
    this.toastService.successToast();
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

    if (this.user) {
      this.allSubscriptions.push(
      this.http.post(this.backendUrls.URLs.updateItemFromCart, data).subscribe((data: any) => {
        if (data.updated) {
          this.fetchDetails();
        }
      }));
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

      this.fetchDetails();
    }

  }

  fetchDetails() {
    const localCart = localStorage.getItem('myCart');
    let cartDetails = localCart ? JSON.parse(localCart) : null;

    if (localCart && this.user) {
      this.allSubscriptions.push(
      this.http.post(this.backendUrls.URLs.addItemsToCart, cartDetails).subscribe((message: any) => {
        this.clearCart('localOnly');

        this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
          this.cartSubject?.next(data);
          this.cartLoading.next(false);
        });
      }));
    }
    else {
      if (!cartDetails) {
        cartDetails = [];
      }
      this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
        this.cartSubject?.next(data);
        this.cartLoading.next(false);
      });
    }
  }

  removeItem(identifier: any) {
    if (this.user) {
      this.allSubscriptions.push(
      this.http.post(this.backendUrls.URLs.removeItemFromCart, { itemId: identifier }).subscribe((message: any) => {
        this.fetchDetails();
      }));
    }
    else {
      const localStorageData = localStorage.getItem("myCart");

      if (localStorageData) {
        this.cartStorage = JSON.parse(localStorageData);

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
      if (this.user) {
        this.allSubscriptions.push(
        this.http.get(this.backendUrls.URLs.clearCart).subscribe(() => { })
        );
      }
    }
    localStorage.removeItem("myCart");
    this.fetchDetails();
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription)=> item.unsubscribe());
  }

}