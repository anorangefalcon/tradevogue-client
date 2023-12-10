import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';
import { HttpParams } from '@angular/common/http';
import { UtilsModule } from 'src/app/utils/utils.module';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class InvoiceTemplateComponent {

  @Input() orderDetail!: any;

  constructor(private fetchData: FetchDataService,private cdr: ChangeDetectorRef ,private backendUrl: UtilsModule) { }

  // orderDetail!: any;

  printInvoice() {
    window.print();
  }

  check(){
    console.log(this.orderDetail);
  }

  public open(orderId: any) {

    // let params: HttpParams = new HttpParams().set("orderID", orderId);

    // this.fetchData.HTTPGET(this.backendUrl.URLs.getSellerOrderDetails, params).subscribe({
    //   next: (res: any) => {
    //     console.log(res);

    //     this.orderDetail = res;        
    //     let totalQty = 0;

    //     res.products.forEach((product: any) => {
    //       totalQty += product.quantity;
    //     });

    //     this.orderDetail.orderDate = new Date(this.orderDetail.orderDate).toDateString()
    //     this.orderDetail['totalQty'] = totalQty;
    //     this.cdr.markForCheck();
    //     this.cdr.detectChanges();
    //   }
    // });

    document.getElementById('invoicePage')?.classList.add('pop_open');

  }

  public close() {
    document.getElementById('invoicePage')?.classList.remove('pop_open');
  }
}
