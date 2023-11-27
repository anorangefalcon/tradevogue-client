import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
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

  constructor(private toastService: ToastService, private http: HttpClient, private backendUrls: UtilsModule, private loginCheckService: LoginCheckService) {
    this.loginCheckService.getUser().subscribe((loggedIn: any) => {
      this.user = loggedIn;
      this.cartLoading.next(true);
      this.fetchDetails();
    });
  }

  addToCart(data: any) {
    this.cartLoading.next(true);
    this.sideCart.next(true);
    
    const cartObj = { 
      "sku": data.sku,
      "size": data.size,
      "color": data.color,
      "quantity": data.quantity 
    };

    if (this.user) {
      this.addToCartWithToken(cartObj);
    }
    else {
      this.addToCartWithoutToken(cartObj);
    }
  }

  private addToCartWithToken(cartObj: any) {
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
    );
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
    
    if (localCart && this.user) {
      this.http.post(this.backendUrls.URLs.addItemsToCart, cartDetails).subscribe((message: any) => {
        this.clearCart('localOnly');

        this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
          this.cartSubject?.next(data);
          this.cartLoading.next(false);
        });
      });
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
      this.http.post(this.backendUrls.URLs.removeItemFromCart, { itemId: identifier }).subscribe((message: any) => {
        this.fetchDetails();
      });
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
        this.http.get(this.backendUrls.URLs.clearCart).subscribe(() => {});
      }
    }
    localStorage.removeItem("myCart");
    this.fetchDetails();
  }

}