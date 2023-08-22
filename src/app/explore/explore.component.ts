import { Component } from '@angular/core';
import { productData } from '../shared/productData';
import { FetchDataService } from '../shared/services/fetch-data.service';
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {

  productArr: productData[] = [];

  constructor(private fetchData: FetchDataService) {
    this.fetchData.getData().subscribe(data => {
      console.log("here", data);
      this.productArr = data.map((item: any) => new productData(item));
      console.log( "product array", this.productArr);
      
    });
  }

}
