import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any[] = [];
  dataLoaded: any = false;
  uniqueData: { [field: string]: any[] } = {};
  filters: any[] = [];
  filterObj :any= {}
  
  

  constructor(private productFilter: ProductsFilterService) {
    this.productFilter.getData().then((data) => {
      // console.log(data);

      this.productData = data.originalData;
      // console.log(this.productData);

      this.uniqueData = data.filterObj;
      console.log(this.uniqueData);

      this.dataLoaded = true;

    });

  }
  toggleShowItems(el: any, eve: any) {

    if (eve.target.innerHTML == 'Show Less') {
      eve.target.innerHTML = 'Show More';
    }
    else {
      eve.target.innerHTML = 'Show Less';
    }
    this.uniqueData[el][-1] = !this.uniqueData[el][-1];

  }
  
  onChecked(el: any, field: string) {
    
    if (!this.filterObj.hasOwnProperty(field)) {
        this.filterObj[field] = [el.target.value]; 
    } else {
        this.filterObj[field].push(el.target.value); 
    }

    console.log(this.filterObj);
}

}

