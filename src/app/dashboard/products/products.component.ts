import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Out of Stock', 'Low Inventory', 'In Stock'];
  categoryOption: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratingOption: any[] = [5, 4, 3, 2];
  pageSize: number = 10;
  currentPage: number = 1;
  productList: any[] = [];

  constructor(private element: ElementRef, private fetchdata: FetchDataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  productTemplate = ['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Published', 'Action'];

  fetchData() {

    this.fetchdata.getSellerData().subscribe((data: any) => {
      let counter = 0
      let products = data[0]['products'][0];
      console.log(typeof (products), products);
      this.productList = [];

      products.forEach((item: any) => {

        let product = {
          itemId: counter++,
          image: '',
          name: '',
          category: '',
          price: 0,
          unit_sold: this.getRandomnumber(150, 400),
          product_inventory: this.getRandomnumber(0, 50),
          rating: 0,
          last_updated: '03/11/2023 - 4.23PM',
          checked: false
        }

        product.image = item['image'][0];
        product.name = item['name'];
        product.category = item['info']['category'];
        product.price = item['price'];

        let reviews = item["reviews"];
        let rating = 0;

        reviews?.forEach((review: any) => {
          rating += review['rating'];
        });

        rating /= reviews?.length;
        product.rating = rating;

        this.productList.push(product);
      })
      console.log("Product List::", this.productList);
    })
    return;
  }

  toggleClass(e: Event){
    let element = <HTMLButtonElement>e.target;
    element.classList.add('action');
    console.log(element);
  }


  getRandomnumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }



  deleteList: any = []
  checkboxParent: any = null;
  checkboxChild: any = null;

  changeDetection(e: Event) {
    let element = (<HTMLInputElement>e.target);
    let id: any = element.getAttribute('id');

    if (id == "all_product") {

      if (element.checked) {
        this.checkboxParent = true;
        this.checkboxChild = true;
        this.productList.forEach((product: any) => {
          this.deleteList.push(product.itemId);
        })
      } else {
        this.checkboxParent = null;
        this.checkboxChild = null;
        this.deleteList = []
      }

    } else {
      if (element.checked) {
        this.deleteList.push(Number(id.split('_')[1]));
      } else {
        if (this.checkboxParent == true) this.checkboxParent = null;
        this.deleteList.splice(this.deleteList.indexOf(Number(id)), 1);
      }
    }
  }
  
  // Delete Selected Enteries
  deleteItems() {
    if (this.deleteList.length != 0) {
      this.productList = this.productList.filter((product: any) => {
        return !this.deleteList.includes(product.itemId);
      })
      this.deleteList = [];
      this.checkboxParent = null;
      this.checkboxChild = null;
    }
  }

  // Delete Single Entry
  deleteItem(entry: any) {
    this.productList.splice(entry, 1);
  }

  filters: any = {
    stockStatus: '',
    productCatgory: '',
    productRating: '',
  };

  // Filter Handling function
  updateFields(e: any, field: string) {
    this.filters[field] = e;
  }
}
