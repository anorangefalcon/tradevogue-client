import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { InvoiceTemplateComponent } from 'src/app/shared/components/invoice-template/invoice-template.component';
import { InvoiceTemplateService } from 'src/app/shared/services/invoice-template.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderPageComponent {
  orderId!: string;
  orderInfo!: any;
  pageTheme: any;
  allSubscriptions: Subscription[] = [];


  constructor(
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule,
    private activeRoute: ActivatedRoute,
    private InvoiceService: InvoiceTemplateService
  ) {
    this.allSubscriptions.push(
      activeRoute.params.subscribe({
        next: async (data) => {
          this.orderId = data['orderId'];
          this.fetchOrderDetail();
        }
      })
    )
    this.allSubscriptions.push(
      this.fetchDataService.themeColor$.subscribe((theme: any) => {
        this.pageTheme = theme;
      })
    );
  }

  fetchOrderDetail() {
    let params: HttpParams = new HttpParams().set("orderID", this.orderId);
    this.allSubscriptions.push(
      this.fetchDataService.HTTPGET(this.backendUrl.URLs.getSellerOrderDetails, params).subscribe({
        next: (data: any) => {
          console.log(data);

          this.orderInfo = data;
          let totalQty = 0;

          data.products.forEach((product: any) => {
            totalQty += product.quantity;
          });

          this.orderInfo.orderDate = new Date(this.orderInfo.orderDate).toDateString()
          this.orderInfo['totalQty'] = totalQty;
        }
      })
    )
  }

  viewInvoice() {
    this.InvoiceService.open(this.orderId);
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
  }
}


