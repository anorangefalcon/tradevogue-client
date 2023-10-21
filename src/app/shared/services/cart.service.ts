import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/utils.module';
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
  // used as a subject for cart to be as observable
  cartSubject = new BehaviorSubject<any>({});
  // actual data lies here
  cart$ = this.cartSubject.asObservable();

  addToCart(data: any) {
    const cartObj = { "sku": data.sku, "size": data.size, "color": data.color, "quantity": data.quantity };
  
    const userToken = this.cookie.get("userToken");

    if (userToken) {
      this.http.post(this.backendUrls.URLs.addItemsToCart, [cartObj]).subscribe((message: any) => {
        console.log(message);
        return;
      });
    }

    const localStorageData = localStorage.getItem("myCart");

    if (localStorageData) {
      this.cartStorage = JSON.parse(localStorageData);
    }

    this.cartStorage.push(cartObj);
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);

    this.fetchDetails();
  }


  updateCart(data: any) {
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

  fetchDetails() {
    const localCart = localStorage.getItem('myCart');
    let cartDetails = localCart ? JSON.parse(localCart) : null;

    return this.http.post(this.backendUrls.URLs.fetchCart, cartDetails).subscribe((data: any) => {      
      this.cartSubject?.next(data);
    });
  }

  removeItem(identifier: any) {

    const userToken = this.cookie.get("userToken");
    if (userToken) {
      this.http.post(this.backendUrls.URLs.removeItemFromCart, {itemId: identifier}).subscribe((message: any) => {
        console.log(message);
      });
    }
    else{
      const localStorageData = localStorage.getItem("myCart");
  
      if (localStorageData) {
        this.cartStorage = JSON.parse(localStorageData);
        console.log(identifier, this.cartStorage);
        
        this.cartStorage.splice(identifier, 1);
      }

      const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
    }


    this.toastService.notificationToast({
      title: 'Item removed!'
    })
    
    this.fetchDetails();
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

}
