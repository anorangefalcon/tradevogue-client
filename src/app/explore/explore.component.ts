import { Component } from '@angular/core';
import { FetchDataService } from '../faq-page/fetch-data.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WishlistService } from '../shared/services/wishlist.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  products: any = [];
  totalProducts: number = 0;
  limit: number = 8;
  pageNumber: number = 1;
  
  OriginalData: any = [];
  uniqueData: { [field: string]: any[] } = {};
  filters: any[] = [];
  filterApplied: { [field: string]: any } = {};

  filtersOpen: boolean = false;
  filterKeys: any = {}
  data: any;
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  colors: string[] = ['#000000', '#ffffff', '#ff0000', '#0357ff', '#008000', '#cf00cf', '#ffff00']
  sorting: any = {
    titles:  ["Fresh Arrivals", "Highest Rated", "Price: High to Low", "Price: Low to High"],
    value: ['createdAt:-1','avgRating:-1', 'price:-1', 'price:1']
  }
  genders : string[] = ['Male', 'Female'];
  minPrice : any;
  maxPrice : any;
  loading: boolean = false;
 
  constructor(private fetchData: FetchDataService, private wishlistService:WishlistService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {

    this.route.queryParams.subscribe((data: any) => {
  
      this.minPrice = data?.minPrice
      this.maxPrice = data?.maxPrice    
      this.loading = true;
      this.filterApplied = JSON.parse(JSON.stringify(data));
      let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(data));

      this.fetchData.getProducts(actualParams, this.limit, 1).subscribe((data: any) => {
        data.items.forEach((el:any)=>{
          this.wishlistService.WishListedProducts.subscribe((response:any)=>{
            if(response.includes(el._id)){
              el.wishlisted=true;
            } 
          })
        })
        console.log(data, "init data");
        
        this.products = data.items;      
        this.totalProducts = data.total;
        this.loading = false;
      
      });
    });

    const body = {
      parameter: "all"
    }

    this.fetchData.getUniqueProductFields(body).subscribe((res: any) => {
      this.uniqueData = res.data;
    })
  }

  onAdd(event: any, field: string) {
    console.log(event, field, "event field");
    
    if (this.minPrice && !this.maxPrice){
      this.filterApplied['minPrice'] = this.minPrice 
    }
    else if (this.maxPrice && !this.minPrice){
      this.filterApplied['maxPrice'] = this.maxPrice
    }
    else if (this.minPrice && this.maxPrice){ 
      this.filterApplied['minPrice'] = this.minPrice 
      this.filterApplied['maxPrice'] = this.maxPrice
    }
    
    if (field == 'sort'){
      let index = this.sorting.titles.findIndex((title: string)=> title == event);
      this.sorting.value[index]    
      this.filterApplied[field] = this.sorting.value[index]
      
    }
    else if(Array.isArray(event)){
      this.filterApplied[field] = event;
    }
    else if (this.filterApplied.hasOwnProperty(field)) {
      this.filterApplied[field] = [this.filterApplied[field]]
      this.filterApplied[field].push(event.length-1)
    }
    else {
      if(event){
      this.filterApplied[field] = event[0]}
    }
    console.log(this.filterApplied, "when setting params");
    
    this.setParams()
  }
  
  isValueSelected(value: any, FilterObjectKey: any[]): any {
    if (!FilterObjectKey) return false;
    if (typeof (FilterObjectKey) == 'string') {
      return value == FilterObjectKey;
    }
    else {
      return FilterObjectKey.includes(value);
    }
  }

  onChecked(event: any, field: string) {
    console.log(event, field, "gender aaya?");
    
    const value = field === 'price' ? Number(event.target.value) : event.target.value;
    if (event.target.checked) {
      if (this.filterApplied.hasOwnProperty(field)) {
        if (Array.isArray(this.filterApplied[field])) {
          this.filterApplied[field].push(value); 
        }
        else {
          let intialValue = this.filterApplied[field];
          this.filterApplied[field] = [intialValue, value];
        }
      }

      else {

        // this.filterApplied[field]=value;
        if (Object.keys(this.filterApplied).length > 0) {
          this.filterApplied[field] = {};

          this.filterApplied[field] = value;
        }

        else {
          let newObject = { [field]: value };
          this.filterApplied = newObject;
        }
      }

    }

    else {
      if (Array.isArray(this.filterApplied[field])) {

        let index = this.filterApplied[field].indexOf(event.target.value);

        this.filterApplied[field].splice(index, 1);
      }
      else {
        delete this.filterApplied[field];
      }
    }

    this.setParams()
  }

  clearAll() {
    let checkboxes: any = document.querySelectorAll('.checkboxes');
    //returns nodelist and type is object

    checkboxes = Array.from(checkboxes)

    checkboxes.forEach(function (checkbox: any) {
      checkbox.checked = false;
    });

    this.fetchData.getProducts({}, this.limit, 1).subscribe((data: any) => {
      this.products = data.items;
      this.location.replaceState("/explore");

    })
    this.filterApplied = {}
    this.minPrice = ''
    this.maxPrice = ''
  }

  onRemove(event: any, field: any) {
    if (Array.isArray(this.filterApplied[field])) {

      let index = this.filterApplied[field].indexOf(event.target.value);

      this.filterApplied[field].splice(index, 1);
    }
    else {
      delete this.filterApplied[field];
    }
    this.setParams()
  }

  setParams(){
    let param = new HttpParams();
    this.loading = true;
    (Object.keys(this.filterApplied)).forEach(key => {

      console.log(this.filterApplied, "plis");
      
      if (Array.isArray(this.filterApplied[key])) {
        this.filterApplied[key].forEach((element: any) => {
          param = param.append(key, element);
        });
      }
      else {
        const valueString = this.filterApplied[key];
        param = param.set(key, valueString);
      }
    });
    
    const finalURL = '/explore' + '?' + param.toString();
    this.location.replaceState(finalURL);

    let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(this.filterApplied));
    console.log(actualParams, "actual params???");
    

    this.fetchData.getProducts(actualParams, this.limit, this.pageNumber).subscribe((data: any) => {
      this.products = data.items
      this.loading = false;
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

  setPriceLimit(){

  }

  changePage(event: any){
    this.pageNumber = event;
    this.setParams();
  }

}
