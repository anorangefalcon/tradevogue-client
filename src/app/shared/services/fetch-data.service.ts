import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.url);
  }
  

  cartStorage : any[] = [];
  addToCart(data: any) {    
    const localStorageData = localStorage.getItem("myCart");
    
    if (localStorageData){
      this.cartStorage = JSON.parse(localStorageData);

      const skuFound = this.cartStorage.find((item:any)=>{
        return item.sku == data.sku;
      });
      if(skuFound){
        return;
      }
    }

    this.cartStorage.push({ "sku": data.sku, "size": data.size, "color": data.color,"Quantity": data.quantity });
    const myCart = JSON.stringify(this.cartStorage);
    localStorage.setItem("myCart", myCart);
  }

}
