import { Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  order_status:string = 'Completed';
  payment_status: string = 'Confirmed';


  categoryOption: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  orderStatus: any[] = ['Confirmed', 'Pending', 'Returned', 'Canceled'];


  constructor(private element: ElementRef){}

  ngOnInit(){
  }

  orders: any[] = [
    {'orderId': '1234', 'orderTime': '2020-12-02' ,'customer': 'Vijay Kumar' ,'amount': 20000, 'quantity': 150,'order_status': 'Confirmed'},
    {'orderId': '1234', 'orderTime': '2020-12-03' ,'customer': 'Davinder Singh' ,'amount': 20000, 'quantity': 200,'order_status': 'Canceled'},
    {'orderId': '1234', 'orderTime': '2020-12-04' ,'customer': 'Vijay Rajan' ,'amount': 20000, 'quantity': 300,'order_status': 'Canceled'},
    {'orderId': '1234', 'orderTime': '2020-12-05' ,'customer': 'Vijay Sharma' ,'amount': 20000, 'quantity': 100,'order_status': 'Confirmed'},
    {'orderId': '1234', 'orderTime': '2020-12-09' ,'customer': 'Vijay Rana' ,'amount': 20000, 'quantity': 150,'order_status': 'Confirmed'},
    {'orderId': '1234', 'orderTime': '2020-12-01' ,'customer': 'Vikas Singh' ,'amount': 20000, 'quantity': 200,'order_status': 'Confirmed'},
    {'orderId': '1234', 'orderTime': '2020-12-02' ,'customer': 'Arshdeep Singh' ,'amount': 20000, 'quantity': 150,'order_status': 'Shipping'},
    {'orderId': '1234', 'orderTime': '2020-12-02' ,'customer': 'Abhishek Kumar' ,'amount': 20000, 'quantity': 200,'order_status': 'Confirmed'}
  ];

  pageSize:number = 8;
  currentPage: number=1;

  pageChanged(event:any){
    this.currentPage = event; 
  }

  updateFields(e: any, type: string){
    console.log(e);
  }
}
