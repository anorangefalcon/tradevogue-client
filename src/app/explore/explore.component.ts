import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service';
import { data } from 'jquery';
import { Observable ,of} from 'rxjs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any[] = [];
  dataLoaded:any=false;
  uniqueData: any[] = [];
  // category=any[]:
  brands:any[]=[];
  constructor(private productFilter: ProductsFilterService) {
    this.productFilter.getData().then((data)=>{
      console.log("data i s",data);
      // data;
      this.productData=data.originalData;
      this.uniqueData=data.filteredObj;
      this.dataLoaded=true;
    });


    console.log("this.prodcut data i s ",this.productData);
    
  
  }


  ngOnInit(){
 
  
  }






}

