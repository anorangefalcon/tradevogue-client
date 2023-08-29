import { Component, HostListener, OnInit } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  navbar_scroll_style: boolean = false;
  cartArr: any[] = []
  cartCount: number = 0;
  subTotal: number = 0;
  oldPrice: number = 0;
  savings: number = 0;
  shipping: number = 0;
  total : number = 0;

  constructor (private service: FetchDataService){}

  // ngOnInit(): void{

  //   const cart = localStorage.getItem("myCart");
  //   this.cartArr = cart ? JSON.parse(cart) : null;

  //   console.log(this.cartArr, "local");
    
  //   setTimeout(() => {
  //     this.service.getData().subscribe((details)=>{
  //       console.log(details, "deets");
  
  //       // console.log("cart item is ",this.cartArr);
        
  //       for (let i = 0; i < this.cartArr.length; i++) {
  //        console.log("inside for loop");
         
  //         this.cartArr[i].extra = details.find((item: any) => {
  //           return item.sku == this.cartArr[i].sku;
  
  //         });
  //         this.subTotal += this.cartArr[i].extra.price*this.cartArr[i].Quantity;
  //         this.oldPrice += this.cartArr[i].extra.oldPrice*this.cartArr[i].Quantity;
  
  //         this.savings = this.oldPrice-this.subTotal;
  
  //         this.shipping+=50;
          
  //         this.cartCount+=1;
          
  //       }
  //       this.total = this.subTotal+this.shipping;
  
  
  //     })
      
  //   }, 2000);
     
  // }

  ngOnInit() {
    const localCart = localStorage.getItem("myCart");
    const localCartArr = localCart ? JSON.parse(localCart) : null;
    this.cartCount = localCartArr.length;
  }

  @HostListener('window:scroll', []) onScroll() {
    if (window.scrollY > 80) {
      this.navbar_scroll_style = true;
    } else {
      this.navbar_scroll_style = false;
    }

  }
}
