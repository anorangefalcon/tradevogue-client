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
  filterObj: any = {}



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

  toggleShowItems(key: any, event: any) {
    let target = event.target.innerHTML;
    event.target.innerHTML = (target === 'Show Less') ? 'Show More' : 'Show Less';
    this.uniqueData[key][-1] = !this.uniqueData[key][-1];
  }

  onChecked(event: any, field: string) {
    if (!this.filterObj.hasOwnProperty(field)) {
      this.filterObj[field] = [event.target.value];
    } else {
      this.filterObj[field].push(event.target.value);
    }

    // console.log(this.filterObj);
  }

}

