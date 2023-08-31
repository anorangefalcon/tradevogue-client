import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsFilterService {
  selectedCategory: string = '';

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  clearFilter(): void {
    this.selectedCategory = '';
  }
}
