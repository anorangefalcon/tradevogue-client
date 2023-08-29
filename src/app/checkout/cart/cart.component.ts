import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartArr: any[] = [];
  totalPrice : number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartArr = this.cartService.fetchCart("details");
    
   }


   remove_item(el:any){
    console.log("el is ",el);
    console.log("cart arr ",this.cartArr);
    
    const x=this.cartArr.filter((item)=>{
      // console.log("item is ",item);
      
      return item.sku!=el;
    })

    console.log("x iw ",x);
    this.cartArr=x;
    
    
   }
}



