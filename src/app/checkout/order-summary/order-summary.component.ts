import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  updateBoolean: boolean = false;
  cart: any = {};

  constructor(private cartService: CartService , private cookie: CookieService , private route:Router) { }

  ngOnInit(): void {
    this.cartService.fetchCart().subscribe((data)=>{
      this.cart = data;
    });
  } 

  redirectToLogin() {
    const returnUrl = '/cart/billing'; 
    this.route.navigate(['/auth/login'], { queryParams: { returnUrl } });
  }

checkLogin() {
  const cookieExists = document.cookie.indexOf('loginDetails') !== -1;
  console.log(cookieExists , "cookies exists");

  // cookieExists == true ? this.updateBoolean = false : this.updateBoolean = true;

  if(!cookieExists){
   this.redirectToLogin();
  }else {
    this.route.navigate(['/cart/billing']);
  }
 }


}


