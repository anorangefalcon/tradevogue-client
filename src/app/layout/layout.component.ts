import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CheckoutService } from '../checkout/checkout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  secureNavBar:Boolean=false;
    constructor(private checkoutService:CheckoutService) {
  this.checkoutService.secureNavbar$.subscribe((data)=>{
    this.secureNavBar=data;
  })
    }

}
