import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTemplateService {

  constructor(private fetchData: FetchDataService, private backendUrl: UtilsModule) {}

  private invoiceSubject = new BehaviorSubject<any>('');
  openInvoice$ = this.invoiceSubject.asObservable();

  open(orderId: any){
    let params: HttpParams = new HttpParams().set("orderID", orderId);

    this.fetchData.HTTPGET(this.backendUrl.URLs.getSellerOrderDetails, params).subscribe((res: any) => {
      this.invoiceSubject.next(res);
    })
  }

  close(){
    this.invoiceSubject.next('');
  }
}
