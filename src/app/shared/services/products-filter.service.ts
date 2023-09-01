import { Injectable, OnInit } from '@angular/core';
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

  new_data: any = [];

  constructor(private fetchData: FetchDataService) { }

  fetchUnique(): any {

    this.fetchData.getData().subscribe((data) => {

      console.log("inside ", data);

      this.productData = data; // we will filter products in ProductData array
      this.originalProductData = data //so that our original values doesnt change
      this.new_data = data;
      console.log("this new data is ", this.new_data);

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

      console.log(this.uniqueValues, "unique");

    })
    console.log("this unique data is ", this.uniqueValues);

    console.log("this. orignal arrau ", this.new_data)

    return { "data": this.new_data, "unique": this.uniqueValues };
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




