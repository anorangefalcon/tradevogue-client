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

  constructor(private element: ElementRef,private myService:FetchDataService) {}

  // constructor(myService:FetchDataService){}
  val: any = '';
  val2: any = 'avfmvkf';
  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Delivered', 'Pending'];
  options: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratings: any[] = [5, 4, 3, 2];

  inventory_status: any = '';
  _rating: any = {};

  new_ratings:any='';
  catgo: any = '';


  filters: any = {};
  items: any[] = [
    {
      itemId: 1,
      product_name: 'Hoddies for Men',
      category: this.options[0],
      price: 2000,
      unit_sold: 300,
      product_inventory: 20,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 2,
      product_name: 'Hoddies for Men',
      category: this.options[1],
      price: 5000,
      unit_sold: 250,
      product_inventory: 10,
      rating: 3,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 2,
      product_name: 'Hoddies for Men',
      category: this.options[1],
      price: 5000,
      unit_sold: 250,
      product_inventory: 10,
      rating: 3,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 3,
      product_name: 'Hoddies for Men',
      category: this.options[2],
      price: 3000,
      unit_sold: 300,
      product_inventory: 20,
      rating: 2,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 4,
      product_name: 'Hoddies for Men',
      category: this.options[0],
      price: 200,
      unit_sold: 250,
      product_inventory: 50,
      rating: 1,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 5,
      product_name: 'Hoddies for Men',
      category: this.options[0],
      price: 5000,
      unit_sold: 900,
      product_inventory: 20,
      rating: 2,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 6,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 3000,
      unit_sold: 300,
      product_inventory: 20,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 7,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 200,
      unit_sold: 250,
      product_inventory: 0,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 8,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 2000,
      unit_sold: 300,
      product_inventory: 10,
      rating: 5,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 9,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 5000,
      unit_sold: 300,
      product_inventory: 10,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Delivered',
    },
    {
      itemId: 10,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 3000,
      unit_sold: 250,
      product_inventory: 20,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 11,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 200,
      unit_sold: 300,
      product_inventory: 0,
      rating: 1,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 12,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 2000,
      unit_sold: 300,
      product_inventory: 20,
      rating: 4,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
    {
      itemId: 13,
      product_name: 'Hoddies for Men',
      category: 'Hoddies',
      price: 2000,
      unit_sold: 500,
      product_inventory: 10,
      rating: 1,
      last_updated: '03/11/2023 - 4.23PM',
      inventory_status: 'Pending',
    },
  ];

  optionChange(val: Event) {
    this.val2 = <HTMLInputElement>val?.target;
    console.log('val s ', this.val);
    this.val = (<HTMLInputElement>val?.target).value;
    let id = this.val2?.getAttribute('id');
    console.log('id is ', id);
    let value = this.val2.value;
    if(id=='inventory_status'){
      this.inventory_status=value;
    }

    else if(id=='rating'){
      this.new_ratings=value;
    } 

    else {
      this.catgo=value;
    }

    this.filters=[{'inventory_status':this.inventory_status},{'category':this.catgo},{'ratings':this.new_ratings}];
    
    // let new_item = { [id]: value };
    
    console.log("inside funciton ")
    // this.filters={};
    this.items=this.myService.filtered_data(this.items,this.filters);
  
  
  }

  deleteFun(el: any) {
    console.log('el is ', el.id);
     this.items.filter((element: any) => {
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
    this.items = this.items.filter((el: any) => {
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
  
  ngAfterViewInit(){
  }

  fetchData(){
    //   this.myService.cart$.subscribe((data:any) => {
    //   // this.cartArr = data;
    //   console.log("inside  funciton ");
    //   Promise.resolve().then(()=>this.items=data);
    //   // this.items=data;
    // });

    console.log("outsied funciton ");
    
    return;
  }




  pageChanged(event: any) {
    this.currentPage = event;
  }

 


}
