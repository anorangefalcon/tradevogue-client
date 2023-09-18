import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';

import { DemoService } from '../demo.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any = [];

  uniqueData: { [field: string]: any[] } = {};
  filters: any[] = [];
  filterObj: any = {}
  FilterApplied: any = {};

  filtersOpen: boolean = false;



  constructor(private productFilter: ProductsFilterService, private demoService: DemoService) {}

  ngOnInit(): void {
    this.productFilter.getData().then((data:any) => {
      this.productData = data.originalData;
      this.uniqueData = data.filterObj;
    });
  }

  toggleShowItems(key: any, event: any) {
    let target = event.target.innerHTML;
    event.target.innerHTML = (target === 'Show Less') ? 'Show More' : 'Show Less';
    this.uniqueData[key][-1] = !this.uniqueData[key][-1];
  }


  onChecked(event: any, field: string) {
    if (event.target.checked) {
      if (Array.isArray(this.FilterApplied[field])) {
        this.FilterApplied[field].push(event.target.value);
      }
      else {
        this.FilterApplied[field] = []
        this.FilterApplied[field].push(event.target.value);
      }
    }
    else {
      this.FilterApplied[field]?.splice(this.FilterApplied[field].indexOf(event.target.value));
    }

    let result: any = []

    result = this.productFilter.Filter2(this.FilterApplied, this.productData).then((data: any) => {
      if (data.length == 0) {
        this.productData = this.productFilter.getData();
        this.productData = this.productData.originalData;
        return;
      }
      this.productData = data;
    });
  }
  toggleFilters() {
    this.filtersOpen = !this.filtersOpen;
  }
}