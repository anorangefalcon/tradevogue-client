import { Component, OnInit} from '@angular/core';
// import $ from 'jquery';
// import 'select2/dist/css/select2.min.css';
// import 'select2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  // product_inventory: number = 0;
  // product_rating: number = 3;
  rating: number[] = [1,2,3,4,5];

  items: any[] = [
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 2000, 'unit_sold': 300, 'product_inventory': 20, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 5000, 'unit_sold': 250, 'product_inventory': 10, 'rating': 3, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 3000, 'unit_sold': 300, 'product_inventory': 20, 'rating': 2, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 200, 'unit_sold': 250, 'product_inventory': 50, 'rating': 1, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 5000, 'unit_sold': 900, 'product_inventory': 20, 'rating': 2, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 3000, 'unit_sold': 300, 'product_inventory': 20, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 200, 'unit_sold': 250, 'product_inventory': 0, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},	
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 2000, 'unit_sold': 300, 'product_inventory': 10, 'rating': 5, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 5000, 'unit_sold': 300, 'product_inventory': 10, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 3000, 'unit_sold': 250, 'product_inventory': 20, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 200, 'unit_sold': 300, 'product_inventory': 0, 'rating': 1, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 2000, 'unit_sold': 300, 'product_inventory': 20, 'rating': 4, 'last_updated': '03/11/2023 - 4.23PM'},
    {"product_name": 'Hoddies for Men', 'category': 'Hoddies', 'price': 2000, 'unit_sold': 500, 'product_inventory': 10, 'rating': 1, 'last_updated': '03/11/2023 - 4.23PM'}
  ];


  pageSize:number = 8;
  currentPage: number=1;

  ngOnInit(): void {
    console.log(this.items);
  }

  pageChanged(event:any){
    this.currentPage = event; 
  }

}
 