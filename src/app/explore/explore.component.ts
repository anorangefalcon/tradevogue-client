import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';
import { data } from 'jquery';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any[] = [];
  uniqueData: any[] = [];
  // category=any[]:
  brands:any[]=[];
  constructor(private productFilter: ProductsFilterService) {

    this.getServiceData();
    console.log("brnad is ",this.uniqueData);
    
  }

  async getServiceData() {

    // const data = await this.productFilter.fetchUnique();
    // console.log("Data is ",data);
    
    // // this.productData = data.productData;
    // // this.uniqueData = data.uniqueData;

    // console.log("Product Data", this.productData);
    // console.log("Unique Data", this.uniqueData);
    // // this.brands=this.uniqueData[1].brands;
    // console.log(this.uniqueData[1].brands, "brands");
    
  }

  // i = 0;
  // categoryChecked(el: any) {

  //   let type = el.target.value;
  //   console.log(type);

  //   if (el.target.checked){

  //     if (this.i == 0) {
  //       let filteredData = (this.original_data.filter((item) => {
  //         return item.info.category == type
  //       }));
  //       this.productArr = filteredData;
  //       this.i++;
  //       return;
  //     }

  //     let filteredData = (this.original_data.filter((item) => {
  //       return item.info.category == type
  //     })
  //     )

  //     filteredData.map(item => {
  //       this.productArr.push(item); 
  //     })


  //   }
  //   if (!el.target.checked) {
  //     this.productArr = this.productArr.filter(item =>
  //       item.info.category != type);
  //   }
  //   // console.log(this.productArr, "finalll");

  //   if (this.productArr.length === 0)
  //   {
  //     this.productArr = this.original_data;
  //     this.i = 0;
  //   }
  // }

  // clear() {
  //   this.productArr = this.original_data;



  // }


}

