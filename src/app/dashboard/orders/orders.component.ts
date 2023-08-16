import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  order_status:string = 'Completed';
  payment_status: string = 'Confirmed';

  orders: any[] = [
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL, XXL','quantity': 150,'order_status': 'Confirmed','payment_status': 'OnDelivery'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L','quantity': 200,'order_status': 'Canceled','payment_status': 'Refund'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL, XXL','quantity': 300,'order_status': 'Canceled','payment_status': 'Failed'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L','quantity': 100,'order_status': 'Confirmed','payment_status': 'OnDelivery'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL, XXL','quantity': 150,'order_status': 'Confirmed','payment_status': 'OnDelivery'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL','quantity': 200,'order_status': 'Confirmed','payment_status': 'Awaiting'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL','quantity': 150,'order_status': 'Shipping','payment_status': 'Confirmed'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL, XXL','quantity': 200,'order_status': 'Confirmed','payment_status': 'Confirmed'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'L, XL, XXL','quantity': 100,'order_status': 'In Route','payment_status': 'Confirmed'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'XL, XXL','quantity': 300,'order_status': 'Confirmed','payment_status': 'OnDelivery'},
    {'orderId': '1234','product': 'Men Jeans','category': 'Jeans','size': 'XL, XXL','quantity': 200,'order_status': 'Confirmed','payment_status': 'OnDelivery'},
  ];

  pageSize:number = 8;
  currentPage: number=1;

  pageChanged(event:any){
    this.currentPage = event; 
  }
}
