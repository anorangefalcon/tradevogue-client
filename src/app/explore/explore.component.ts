import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service'
import { FetchDataService } from '../shared/services/fetch-data.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsModule } from 'src/app/utils/utils.module';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  products: any = [];
  OriginalData: any = [];
  uniqueData: { [field: string]: any[] } = {};
  filters: any[] = [];
  filterApplied: { [field: string] : any} = {};
  
  // Object.preventExtensions(filterApplied);
  filtersOpen: boolean = false;
  filterKeys: any = {}
  data: any;
  constructor(private productFilter: ProductsFilterService, private fetchData: FetchDataService, private http: HttpClient, private route: ActivatedRoute, private location: Location, private backendUrls: UtilsModule, private fetchDataService: FetchDataService) { }

  ngOnInit() {

    this.route.queryParams.subscribe((data: any) => {
      
      this.filterApplied=JSON.parse(JSON.stringify(data));

      let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(data));
  
      this.fetchData.getProducts(actualParams).subscribe((data: any) => {
        this.products = data.items
        console.log("filtered products" , this.products); //2 
        
      });
    });

    const body = {
      parameter: "all"
    }

    this.fetchData.getUniqueProductFields(body).subscribe((res: any) => {
  
      this.uniqueData = res.data;
    })
  }

  isValueSelected(value: any, FilterObjectKey: any[]): any {
   
    if(!FilterObjectKey) return false;
    if(typeof(FilterObjectKey)=='string'){
      return value==FilterObjectKey;
    }
    else{
      return FilterObjectKey.includes(value); 
    }
  
   
  }

  onChecked(event: any, field: string) {
    
    console.log('event is ', event.target.checked," field is ",field);
    
    const value = field === 'price' ? Number(event.target.value) : event.target.value;
    if (event.target.checked) {

      
      if (this.filterApplied.hasOwnProperty(field)) {
        
        if (Array.isArray(this.filterApplied[field])) {
          this.filterApplied[field].push(value); // Add value to the existing array
          
        }
        else {
          let intialValue = this.filterApplied[field];
          console.log('intial value is ',intialValue," filterapplied is ",this.filterApplied);
          
             this.filterApplied[field]=[intialValue,value];
          // this.filterApplied[field].push(intialValue,value);

        }
      }
      
      else {

        // this.filterApplied[field]=value;
        if(Object.keys(this.filterApplied).length>0){
          this.filterApplied[field]={};

          this.filterApplied[field]=value;
        } 
        
        else{
          let newObject={[field]:value};
          this.filterApplied=newObject;
        }
       

        
      }
      
    }

    else{
  //  console.log('hello  ', this.filterApplied[field].splice(event.target.value));
      if(Array.isArray(this.filterApplied[field])){
        console.log(" field is  ",field,'filter object is ',this.filterApplied," value is ",event.target.value);
        
          let index=this.filterApplied[field].indexOf(event.target.value);
          console.log('index is ',index,);
          
         this.filterApplied[field].splice(index,1);
        console.log('filterApplied intiall y is is ',this.filterApplied);
      }
      else{
        delete this.filterApplied[field];
      }
    }

      let param = new HttpParams();
      console.log('FILTRP APPLIED IS ',this.filterApplied);
      
      (Object.keys(this.filterApplied)).forEach(key => {

        if (Array.isArray(this.filterApplied[key])) {
          this.filterApplied[key].forEach((element: any) => {
            param = param.append(key, element);
          });
        }
        else {
          // console.log('this.filterApplied[key]----- is ', this.filterApplied[key]);

          const valueString = this.filterApplied[key];
          param = param.set(key, valueString);
        }
      });
      const finalURL = '/explore' + '?' + param.toString();
      this.location.replaceState(finalURL);


      let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(this.filterApplied));
      // console.log('actual param is ',actualParams);
      
      this.fetchData.getProducts(actualParams).subscribe((data: any) => {
        this.products = data.items
        console.log("filtered products" , this.products); //2 
        
      });

      console.log('FILTER OBJECT IS ',this.filterApplied);
      
  }

  clearAll() {
    let checkboxes: any = document.querySelectorAll('.checkboxes');
    //returns nodelist and type is object

    console.log('checkbox is ', checkboxes, "type is ", typeof (checkboxes));
    checkboxes = Array.from(checkboxes)

    checkboxes.forEach(function (checkbox: any) {
      checkbox.checked = false;
    });

    this.fetchData.getProducts({}).subscribe((data: any) => {
      this.products = data.items;
      console.log(this.products, "proooo");
      this.location.replaceState("/explore");

    })
    this.filterApplied = {}
  }

  onRemove(event: any, field:any) {
    if(Array.isArray(this.filterApplied[field])){
      console.log(" field is  ",field,'filter object is ',this.filterApplied," value is ",event.target.value);
      
        let index=this.filterApplied[field].indexOf(event.target.value);
        console.log('index is ',index,);
        
       this.filterApplied[field].splice(index,1);
      console.log('filterApplied intiall y is is ',this.filterApplied);
    }
    else{
      delete this.filterApplied[field];
    }


    let param = new HttpParams();
    console.log('FILTRP APPLIED IS ',this.filterApplied);
    
    (Object.keys(this.filterApplied)).forEach(key => {

      if (Array.isArray(this.filterApplied[key])) {
        this.filterApplied[key].forEach((element: any) => {
          param = param.append(key, element);
        });
      }
      else {
        // console.log('this.filterApplied[key]----- is ', this.filterApplied[key]);

        const valueString = this.filterApplied[key];
        param = param.set(key, valueString);
      }
    });
    const finalURL = '/explore' + '?' + param.toString();
    this.location.replaceState(finalURL);

    let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(this.filterApplied));
     console.log('actual params is ',actualParams);
     
    this.fetchData.getProducts(actualParams).subscribe((data: any) => {
      this.products = data.items
      console.log("filtered products" , this.products); //2 
      
    });
  }


  isString(value: any): boolean {
    return typeof value === 'string';
  }


  toggleShowItems(key: any, event: any) {
    let target = event.target.innerHTML;

    event.target.innerHTML = (target === 'Show Less') ? 'Show More' : 'Show Less';
    this.uniqueData[key][-1] = !this.uniqueData[key][-1];
  }

}