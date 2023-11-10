import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/faq-page/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderPageComponent {
  orderId!: string;
  orderInfo!: any;

  constructor(
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule,
    private activeRoute: ActivatedRoute
  ) {
    activeRoute.params.subscribe({
      next: async (data) => {
        this.orderId = data['orderId'];
        this.fetchOrderDetail();
      }
    });
  }

  fetchOrderDetail() {
    this.fetchDataService.HTTPGET(this.backendUrl.URLs.getSellerOrderDetails, this.orderId, 'orderID').subscribe({
      next: (data: any)=>{
        console.log(data);
        this.orderInfo = data;

        let totalQty = 0;
        let totalAmount = 0;

        data.products.forEach((product: any)=>{
            totalQty += product.quantity;
            totalAmount += product.amount;
        });

        this.orderInfo.orderDate = new Date(this.orderInfo.orderDate).toDateString()

        this.orderInfo['totalQty'] = totalQty;
        this.orderInfo['totalAmount'] = totalAmount;
      }
    })
  }
  printInvoice(){
      window.print();
  }
}


