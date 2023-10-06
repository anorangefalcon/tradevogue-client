import { Component } from '@angular/core';
import { ProductsFilterService } from '../shared/services/products-filter.service'
import { FetchDataService } from '../shared/services/fetch-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent {

  productData: any = [];
  OriginalData: any = [];
  uniqueData: { [field: string]: any[] } = {};
  filters: any[] = [];
  FilterApplied: any = {};
  filtersOpen: boolean = false;

  constructor(private productFilter: ProductsFilterService, private fetchData: FetchDataService,private http:HttpClient) { }

  ngOnInit(): void {
    this.productFilter.getData().then((data: any) => {
      this.productData = data.originalData;
      this.OriginalData = this.productData;
      this.uniqueData = data.filterObj;
      console.log('unique data is ',this.uniqueData);

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

    this.fetchData.getData().subscribe((data: any) => {
      this.productData = data
    })
  }


  toggleShowItems(key: any, event: any) {
    let target = event.target.innerHTML;
    event.target.innerHTML = (target === 'Show Less') ? 'Show More' : 'Show Less';
    this.uniqueData[key][-1] = !this.uniqueData[key][-1];
  }


  onChecked(event: any, field: string) {
    if (event.target.checked) {

      if (Array.isArray(this.FilterApplied[field])) {
        let value = event.target.value;
        if (field == 'price') {

          value = Number(event.target.value)
        }

        this.FilterApplied[field].push(value);

      }
      else {
        this.FilterApplied[field] = []
        let value = event.target.value;

        if (field == 'price') {
          value = Number(event.target.value)
        }
        this.FilterApplied[field].push(value);
      }
    }
    else {
      this.FilterApplied[field]?.splice(this.FilterApplied[field].indexOf(event.target.value));
    }

    let result: any = []

    result = this.productFilter.Filter(this.FilterApplied, this.OriginalData).then((data: any) => {
      // if (data.length == 0) {
      //   this.productData = this.productFilter.getData();
      //   this.productData = this.productData.originalData;
      //   return;
      // }
      this.productData = data;
    });
  }
}