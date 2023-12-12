import { Component, ViewEncapsulation } from '@angular/core';
import { InvoiceTemplateService } from '../../services/invoice-template.service';
import { Subscription } from 'rxjs';
import { FetchDataService } from '../../services/fetch-data.service';

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class InvoiceTemplateComponent {

  openInvoiceTemplate: Boolean = false;
  orderDetail!: any;
  pageTheme: any = false;

  invoiceSubscription!: Subscription;

  constructor(private invoiceService: InvoiceTemplateService, private fetchDataService: FetchDataService) {

    this.fetchDataService.themeColor$.subscribe((theme: any)=>{
      this.pageTheme = theme;
    })
    
    this.invoiceSubscription = this.invoiceService.openInvoice$.subscribe((orderDetail: any)=>{
      
      if(!orderDetail) {
        this.openInvoiceTemplate = false;
        return;
      }

      this.setData(orderDetail);
      this.openInvoiceTemplate = true;
    });

  }

  ngOnInit(): void {
  }

  private setData(orderDetail: any) {
    this.orderDetail = orderDetail;

    let totalQty = 0;
    orderDetail.products.forEach((product: any) => {
      totalQty += product.quantity;
    });

    this.orderDetail.orderDate = new Date(this.orderDetail.orderDate).toDateString()
    this.orderDetail['totalQty'] = totalQty;

  }

  close() {
    this.invoiceService.close();
  }

  printInvoice() {
    window.print();
  }

  ngOnDestroy() {
    this.invoiceSubscription?.unsubscribe();
   }
}
