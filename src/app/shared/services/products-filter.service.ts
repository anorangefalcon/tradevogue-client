import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsFilterService {

  productData: any[] = [];
  originalProductData: any[] = [];
  uniqueValues: any[] = [
    { 'categories': [] },
    { 'brands': [] },
    { 'colors': [] },

  ];


  constructor(private fetchData: FetchDataService) { }

  async fetchUnique() {

    const data = await this.fetchData.getData().toPromise();

    this.productData = data; // we will filter products in ProductData array
    this.originalProductData = data //so that our original values doesnt change

    this.productData.forEach((product) => {
      let category = product.info.category;

      if (!this.uniqueValues[0].categories.includes(category)) {
        this.uniqueValues[0].categories.push(category);
      }

      let brand = product.info.brand;

      if (!this.uniqueValues[1].brands.includes(brand)) {
        this.uniqueValues[1].brands.push(brand);
      }

      let color = product.colors;
      this.uniqueValues[2].colors = this.uniqueValues[2].colors.concat(color);

    });

    this.uniqueValues[2]['colors'] = this.filterColor(this.uniqueValues[2].colors);

    console.log("Unique Values: ", this.uniqueValues);

    return { "productData": this.originalProductData, "uniqueData": this.uniqueValues};
  }

  filterColor(data: any) {
    data = data.filter((item: any, index: any) => {

      const result = data.indexOf(item) == index;

      if (result) {
        return item;
      }

    })
    return data;
  }



}




