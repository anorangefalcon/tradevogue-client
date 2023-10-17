import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service'
import { FetchDataService } from '../shared/services/fetch-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  filterApplied: any = {};
  filtersOpen: boolean = false;
  filterKeys: any = {}

  constructor(private productFilter: ProductsFilterService, private fetchData: FetchDataService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data, "paramsss");
      
      let actualParams = (Object.keys(this.filterApplied).length > 0) ? this.filterApplied : JSON.parse(JSON.stringify(data));
      this.fetchData.getProducts(actualParams).subscribe((data: any) => {
        // console.log('data', data);
        this.products = data.items
        console.log(this.products, "allll");
        
      });
    });
    this.fetchData.getUniqueProductFields().subscribe((res: any) => {
      this.uniqueData = res.data;
    })
  }

  onChecked(event: any, field: string) {

    const value = field === 'price' ? Number(event.target.value) : event.target.value;

    if (event.target.checked) {
      if (this.filterApplied.hasOwnProperty(field)) {
        if (Array.isArray(this.filterApplied[field])) {
          this.filterApplied[field].push(value);
        } else {
          this.filterApplied[field] = [this.filterApplied[field], value];
        }
      } else {
        this.filterApplied[field] = value;
      }
    }
    else {
      if (Array.isArray(this.filterApplied[field]))
        this.filterApplied[field].splice(this.filterApplied[field].indexOf(value), 1)
    }

    this.fetchData.getProducts(this.filterApplied).subscribe((data: any) => {
      console.log('data', data);

      this.products = data.items

    });

    
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
      
    })
  }

  toggleShowItems(key: any, event: any) {
    let target = event.target.innerHTML;

    event.target.innerHTML = (target === 'Show Less') ? 'Show More' : 'Show Less';
    this.uniqueData[key][-1] = !this.uniqueData[key][-1];
  }


  removeEmptyKeys(filteredObject: any) {
    for (const key in filteredObject) {

      if (Array.isArray(filteredObject[key]) && filteredObject[key].length == 0) delete filteredObject[key];
    }
  }

}