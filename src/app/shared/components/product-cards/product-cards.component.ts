import { Component } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';

@Component({
  selector: 'app-product-cards',
  templateUrl: './product-cards.component.html',
  styleUrls: ['./product-cards.component.css']
})
export class ProductCardsComponent {

  products: any = [];

  constructor(public fetchProducts: FetchDataService){
    fetchProducts.getData().subscribe((data)=>{
      console.log(data,"davinder here");
      this.products = data.slice(0, 4);
    });
  }

}
