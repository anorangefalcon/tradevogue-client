import { Component, OnInit } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  productArr: any[] = [];
  original_data: any[] = [];
  colors: string[] = ["Blue", "Black", "Green"];
  categories: any[] = [];
  selectedCategory: string[] = [];
  selectedColor: string[] = [];

  constructor(private fetchData: FetchDataService) {}

  ngOnInit(): void {
    this.fetchData.getData().subscribe(data => {
      this.productArr = data;
      this.original_data = data;

      this.productArr.forEach(product => {
        if (!this.categories.includes(product.info.category)) {
          this.categories.push(product.info.category);
        }
      });
    });
  }

  toggleCategory(category: any) {
    if (this.selectedCategory.includes(category)) {
      this.selectedCategory = this.selectedCategory.filter(c => c !== category);
    } else {
      this.selectedCategory.push(category);
    }

    this.applyFilters();
  }

toggleColor(color: any) {
  if (this.selectedColor.includes(color)) {
    this.selectedColor = this.selectedColor.filter(c => c !== color);
  } else {
    this.selectedColor.push(color);
  }

  this.applyFilters();
}

  applyFilters() {
    if (this.selectedCategory.length > 0 || this.selectedColor.length > 0) {
      this.productArr = this.original_data.filter(item =>
        this.selectedCategory.includes(item.info.category) ||
        this.selectedColor.some(color => item.colors.includes(color))
      );
    } else {
      this.productArr = this.original_data;
    }
  }

  clear() {
    this.selectedCategory = [];
    this.selectedColor = []; 
    this.applyFilters();
  }
}
