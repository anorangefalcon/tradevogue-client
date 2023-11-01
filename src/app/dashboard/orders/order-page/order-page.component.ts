import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
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
        console.log(data.sellerAdd);
        this.orderInfo = data;
      }
    })
  }
}
