import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';

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

  @Input() orderInfo: any;
  @ViewChild('invoicePage') content!: ElementRef;

  constructor(private fetchData: FetchDataService){}
  
  ngOnInit(){

  }

  printInvoice(){
    window.print();
  }

  public open(){
    document.getElementById('invoicePage')?.classList.add('pop_open');
    // this.content.nativeElement.classList.add('pop_open');
  }

  public close(){
    document.getElementById('invoicePage')?.classList.remove('pop_open');
    // this.content.nativeElement.classList.remove('pop_open');
  }
}

    // let params: HttpParams = new HttpParams().set("orderID", orderId);
    // console.log("dasda", orderId);
    // this.fetchData.HTTPGET(this.backendUrl.URLs.getSellerOrderDetails, params).subscribe({
    //   next: (res: any) => {
    //     console.log(res);

    // this.orderInfo = order;
    //     let totalQty = 0;

    //     res.products.forEach((product: any)=>{
    //         totalQty += product.quantity;
    //     });

    //     this.orderInfo.orderDate = new Date(this.orderInfo.orderDate).toDateString()
    //     this.orderInfo['totalQty'] = totalQty;
    //   }
    // });
