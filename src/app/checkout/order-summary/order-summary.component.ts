import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {

  storageCart: any[] = [];
  subTotal: number = 0;
  oldPrice: number = 0;
  savings: number = 0;
  shipping: number = 0;
  total : number = 0;

  constructor(private service: FetchDataService) {
    const cart = localStorage.getItem("myCart");
  
    this.storageCart = cart ? JSON.parse(cart) : null;
    console.log(this.storageCart, "parse");

    let no = this.storageCart

    service.getData().subscribe((data) => {

      for (let i = 0; i < this.storageCart.length; i++) {
       
        this.storageCart[i].extra = data.find((item: any) => {

          return item.sku == this.storageCart[i].sku; 

        });

        this.subTotal += this.storageCart[i].extra.price*this.storageCart[i].Quantity;
        this.oldPrice += this.storageCart[i].extra.oldPrice*this.storageCart[i].Quantity;

        this.savings = this.oldPrice-this.subTotal;

        this.shipping+=50;
      }
      this.total = this.subTotal+this.shipping;

    });





   

  }

}


