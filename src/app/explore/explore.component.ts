import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any[] = [];
  dataLoaded:any = false;
  uniqueData = {};
  filters : any[] = [];
 
  constructor(private productFilter: ProductsFilterService) {
    this.productFilter.getData().then((data)=>{
      // console.log(data);
      
      this.productData=data.originalData;
      // console.log(this.productData);
      
      this.uniqueData=data.filterObj;
      // console.log(this.uniqueData);

      this.dataLoaded=true;

    });

  }
}

