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
      console.log(data);
      this.products = data.slice(0,5);
      // for(let i=0; i<data.length; i++){
      //   this.products.push(data[i]);
      //   if(i>=3){
      //     break;
      //   }
      // }    
    });
  }

}
