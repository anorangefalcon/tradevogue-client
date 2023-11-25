import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { UtilsModule } from './../../utils/utils.module';
import { LoginCheckService } from './login-check.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private toastService: ToastService, private router: Router, private http: HttpClient, private backendUrls: UtilsModule, private loginCheckService: LoginCheckService) {
    this.loginCheckService.getUser().subscribe((loggedIn: any) => {
      this.user = loggedIn;
      this.cartLoading.next(true);
      this.fetchDetails();
    });
  }

  user: boolean = false;
  // used to add items to cart in localStorage
  cartStorage: any[] = [];
  sideCart = new BehaviorSubject<any>('');
  // used as a subject for cart to be as observable
  private cartSubject = new BehaviorSubject<any>([]);
  // actual data lies here
  private cart$ = this.cartSubject.asObservable();

  cartLoading = new BehaviorSubject<Boolean>(false);

  addToCart(data: any) {
    this.cartLoading.next(true);
    this.sideCart.next(true);

    const cartObj = { "sku": data.sku, "size": data.size, "color": data.color, "quantity": data.quantity };
    if (this.user) {
      this.addToCartWithToken(cartObj);
      
    }
    else {
      this.addToCartWithoutToken(cartObj);
      this.cartLoading.next(false);
    }
  }

  private addToCartWithToken(cartObj: any) {
    this.http.post(this.backendUrls.URLs.addItemsToCart, [cartObj]).subscribe(
      (details: any) => {
        if (!details.added) {
          this.toastService.warningToast({ title: 'Item already exists in cart please select another configuration' });
          // this.router.navigate(['/product/' + cartObj.sku])
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
      this.toastService.warningToast({ title: 'Item already exists in cart' });
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

      this.cartLoading.next(true);
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
          this.cartLoading.next(false);
          this.cartSubject?.next(data);
        });
      });
    }
    else {
      if (!cartDetails) {
        cartDetails = [];
      }
      this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {
        this.cartLoading.next(false);
        this.cartSubject?.next(data);
      });
    }
  }

  removeItem(identifier: any) {
    if (this.user) {
      this.http.post(this.backendUrls.URLs.removeItemFromCart, { itemId: identifier }).subscribe((message: any) => {
        // this.ItemDeleted=true;
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
        this.http.get(this.backendUrls.URLs.clearCart).subscribe((message: any) => {
        });
      }
    }
    localStorage.removeItem("myCart");
  }

}