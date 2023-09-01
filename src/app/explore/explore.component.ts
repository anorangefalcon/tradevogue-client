import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { ProductsFilterService } from '../shared/services/products-filter.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productArr: any[] = [];
  original_data: any[] = []; 
  // colors:any=[];
  unique:any=[];
  categories: any[] = [];
  
  selectedCategory: String = '';

  constructor(private fetchData: FetchDataService,private myservice:ProductsFilterService) {

   let obj= this.myservice.fetchUnique();
  // console,
  this.productArr=obj.data;
  this.unique=obj.unique;

  console.log("product is ",this.productArr);
  console.log("uniique is ",this.unique);
  
  
  }

  i = 0;
  categoryChecked(el: any) {

    let type = el.target.value;
    console.log(type);

    if (el.target.checked){

      if (this.i == 0) {
        let filteredData = (this.original_data.filter((item) => {
          return item.info.category == type
        }));
        this.productArr = filteredData;
        this.i++;
        return;
      }
  
      let filteredData = (this.original_data.filter((item) => {
        return item.info.category == type
      })
      )
  
      filteredData.map(item => {
        this.productArr.push(item); 
      })
   

    }
    if (!el.target.checked) {
      this.productArr = this.productArr.filter(item =>
        item.info.category != type);
    }
    // console.log(this.productArr, "finalll");

    if (this.productArr.length === 0)
    {
      this.productArr = this.original_data;
      this.i = 0;
    }
  }

  clear() {
    this.productArr = this.original_data;
    
    
    
  }
  

}

