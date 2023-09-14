import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  // product_inventory: number = 0;
  // product_rating: number = 3;

  constructor(private element: ElementRef, private fetchdata: FetchDataService) { }

  val: any = '';
  val2: any = 'avfmvkf';
  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Delivered', 'Pending'];
  options: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratings: any[] = [5, 4, 3, 2];

  inventory_status: any = '';
  _rating: any = {};

  new_ratings: any = '';
  catgo: any = '';


  filters: any = {};


  optionChange(val: Event) {
    this.val2 = <HTMLInputElement>val?.target;
    console.log('val s ', this.val);
    this.val = (<HTMLInputElement>val?.target).value;
    let id = this.val2?.getAttribute('id');
    console.log('id is ', id);
    let value = this.val2.value;
    if (id == 'inventory_status') {
      this.inventory_status = value;
    }

    else if (id == 'rating') {
      this.new_ratings = value;
    }

    else {
      this.catgo = value;
    }

    this.filters = [{ 'inventory_status': this.inventory_status }, { 'category': this.catgo }, { 'ratings': this.new_ratings }];
    console.log("inside funciton ")
    // this.filters={};
    this.fetchdata.filtered_data(this.productList, this.filters);


  }

  deleteFun(el: any) {
    console.log('el is ', el.id);
    this.productList.filter((element: any) => {
      return element.itemId != el.itemId;
    });


  }

  check(el: any) {
    if (el.checked == true) {
      delete el.checked;
      return;
    }
    el.checked = true;
    // console.log("el inisde check is ",el);
  }
  DeleteAll() {
    this.productList = this.productList.filter((el: any) => {
      return el.checked != true;
    });
  }

  pageSize: number = 8;
  currentPage: number = 1;



  ngOnInit(): void {
    // console.log(this.items);
    this.fetchData();
    // Promise.resolve().then(()=>this.fetchData());
  }

  ngAfterViewInit() {
  }



  productList: any[] = [];

  fetchData() {
    //   this.myService.cart$.subscribe((data:any) => {
    //   // this.cartArr = data;
    //   console.log("inside  funciton ");
    //   Promise.resolve().then(()=>this.items=data);
    //   // this.items=data;
    // });

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

    console.log("outsied funciton ");

    return;
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
    let element = (<HTMLInputElement>e.target)
    let id: any = element.getAttribute('id');
    console.log(id)

    if (id == "all_product") {
      console.log('hello->all');
      if(element.checked){
        this.checkboxParent = true;
        this.checkboxChild = true;
        this.productList.forEach((product: any)=>{
          this.deleteList.push(product.itemId);
        })
      }else{
        this.checkboxParent = null;
        this.checkboxChild = null;
        this.deleteList = []
      }

    } else{
      console.log('hello->child');
      if (element.checked){
        this.deleteList.push(Number(id));
      } else { 
        if(this.checkboxParent == true) this.checkboxParent = null;
        this.deleteList.splice(this.deleteList.indexOf(Number(id)), 1);
      }
    }
    // console.log(this.deleteList);
    
  }

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


}
