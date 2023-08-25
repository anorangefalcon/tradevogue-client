import { Component } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartArr: any[] = [];
  size: string = "";
  color: string = "";

  constructor(private service: FetchDataService) {
    const cart = localStorage.getItem("myCart");
   
    this.cartArr = cart ? JSON.parse(cart) : null;
    console.log(this.cartArr, "parse");

    service.getData().subscribe((data) => {

      for (let i = 0; i < this.cartArr.length; i++) {
       
        this.cartArr[i].extra = data.find((item: any) => {
          return item.sku == this.cartArr[i].sku;

        });
      }

    });

  }
}



