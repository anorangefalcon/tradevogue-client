import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Observable, Subject, filter, map, tap, BehaviorSubject} from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl = '../../../assets/tempDB/usersData.json';
  sellerUrl = '../../../assets/tempDB/seller.json';
  subject = new BehaviorSubject<any>('');
  subOb$ = this.subject.asObservable();
  ShowAddress=new Subject();
  
  constructor(private http: HttpClient, private toastService: ToastService, private backendUrls: UtilsModule, private route: ActivatedRoute) { }

  productKeys: any = ['available', 'colors', 'description', 'image', 'info', 'name', 'price', 'oldPrice', 'orderQuantity', 'reviews', 'sizes', 'sku', 'stockQuantity'];
   getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      map((arrayData: any) => {
        return arrayData.filter((item: any) => {

          return (Object.keys(item).length > 0) && (this.productKeys.length === Object.keys(item).length)
        });
      })
    )
  }

  getUserData(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  getSellerData(): Observable<any> {
    return this.http.get(this.sellerUrl);
  }

  HttpPostRequest(url: any, body: any) {
    return this.http.post(this.sellerUrl, body);
  }

  HttpGetRequest(url: any) {
    return this.http.get(this.sellerUrl);
  }

  getUniqueProductFields(){
    return this.http.get('http://localhost:1000/products/uniqueFields');
  }

  getProductDetails(sku: any) {
    let params = new HttpParams();
    params = params.set("sku", sku);
    console.log(params);

    return this.http.get(this.backendUrls.URLs.fetchProductUrl, { params })
  }

  getProducts(data:any = '') {
    let params = new HttpParams();
    
    (Object.keys(data)).forEach(key => {
      
      if(Array.isArray(data[key])){
        console.log(data[key]);
        data[key].forEach((element:any) => {
          params = params.append(key, element);
        });
      }
      else{
        params = params.set(key, data[key]);
      }
    }); 
    
    return this.http.get(this.backendUrls.URLs.fetchProducts, { params });
  }

  httpPost(url: any, body: any) {

    return new Promise((res, rej) => {
      console.log('POST MEETHOD CALLED ', url, " BODY IS ", body);

      this.http.post(url, body).subscribe({
        next: (data) => {
          console.log('DATA INSIDE NE');

          res(data);
          console.log(data, "ervice data");
          this.toastService.successToast(data);
          
        }, error: (error) => {

          rej(error)
          if (error.message) {
            const data = { title: error.error.message };
            this.toastService.errorToast(data);
          }
        }
      })
    })

  }

  httpGet(url: any) {
  
    
    return new Promise((res, rej) => {
      this.http.get(url).subscribe({
        next: (data) => {
          res(data);

        }, error: (error) => {
          
          rej(error)   
          if (error.message) {
            const data = { title: error.error.message };
            this.toastService.errorToast(data);
          }
        }
      })
    })

  }




}