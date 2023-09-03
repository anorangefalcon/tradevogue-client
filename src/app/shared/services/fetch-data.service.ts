import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl='../../../assets/tempDB/usersData.json';
  sellerUrl='../../../assets/tempDB/seller.json';
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.url);
  }

  getUserData() {
    // let x;
    //  const x=this.http.get(this.userUrl).toPromise();

     return this.http.get(this.userUrl);
  }

  getSellerData(){
    return this.http.get(this.sellerUrl);
  }

  //  CHANGE FILTER DATA

  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Delivered', 'Pending'];
  options: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratings: any[] = [5, 4, 3, 2];

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

  data = new BehaviorSubject<any>(this.items);
  // actual data lies here
  cart$ = this.data.asObservable();

  filtered_data(value: any, filtered_arr: any) {
    filtered_arr = {
      color: ['A', 'B'],
      brand: ['DEor', 'xyz'],
      price: [100, 200],
    };


    // res =[ {color:'A'},{color:'B'},{brand:'DEor'},{brand:'xyz'},{price:100},{price:200}]
   


    let new_filter: any = [];
    // console.log("object.key s ", Object.keys((filtered_arr)));
    Object.keys(filtered_arr).forEach((el) => {
      // console.log("hii");
      new_filter = new_filter.concat({ [el]: filtered_arr[el] });
    });

    let final_result = [];
    let key = Object.keys(new_filter);
    console.log('ner filter is ', new_filter);
    console.log('filter is ', filtered_arr);

    new_filter.forEach((el: any) => {
      console.log('el is ', el);
      // if()
      // let another_key=Object.keys(el)[0];
      // console.log(" kvf vdfvu is ",);
      if (Object.keys(el)[0] == key[0]) {
        this.items.filter((o) => {
          // console.log("el inisd eis ",o);
        });
      }
    });

    // console.log("new filter is ",new_filter);

    return value;
  }
}
