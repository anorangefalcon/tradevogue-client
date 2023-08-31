import { Component, OnInit } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';
import { FetchDataService } from '../shared/services/fetch-data.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  productArr: any[] = [];
  original_data: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';

  constructor(
    private fetchData: FetchDataService,
    private productFilter: ProductsFilterService
  ) {}

  ngOnInit(): void {
    this.fetchData.getData().subscribe(data => {
      this.productArr = data;
      this.original_data = data;

      for (let i = 0; i < this.productArr.length; i++) {
        let category = this.productArr[i]['info']['category'];
        if (!this.categories.includes(category)) {
          this.categories.push(category);
        }
      }
    });
  }

  applyCategoryFilter(): void {
    if (this.selectedCategory) {
      this.productArr = this.original_data.filter(item =>
        item.info.category === this.selectedCategory
      );
    } else {
      this.productArr = this.original_data;
    }
  }

  clear(): void {
    this.selectedCategory = '';
    this.productFilter.clearFilter();
    this.productArr = this.original_data;
  }
}
