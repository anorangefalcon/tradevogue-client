import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsModule } from 'src/app/utils/utils.module';
import { HttpParams } from '@angular/common/http';
import { LoginCheckService } from './login-check.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SellerFetchDataService {

  url = '../../../assets/tempDB/seller.json';
  orderurl = '../../../assets/tempDB/orders.json'
  userToken: any = '';

  constructor(private http: HttpClient,
     private backendUrl: UtilsModule,
      private userService: LoginCheckService,
      private toastservice: ToastService) { }

  ngOnInit(){
    this.userService.getUser('token').subscribe((token: any)=>{
      this.userToken = token;
    });
  }

  detailedInfo(): Observable<any>{
    return this.http.get(this.url);
  }
  getFeatureInfo(){
    let feature: any = []
    this.detailedInfo().subscribe((data: any)=>{
      return data[0];
    });
  }

  getSellerInfo(): Observable<any> {
    const params = new HttpParams().set('token', this.userToken);
    return this.http.get(this.backendUrl.URLs.getAccount, { params });
  }
  
  sendSellerInfo(data: any){
    this.http.post(this.backendUrl.URLs.updateAccount, {'data': data}).subscribe((data: any) => {
        this.toastservice.successToast({ title: "Account Updated Successfully" });
        });
  }

  sendPinInfo(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://localhost:4000/api/purchaser/sendPinInfo', data);
  }

  getProductInfo(){

  }

  getOrderInfo(){
  }

}
