import { Component, ElementRef, HostListener } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SidecartService } from '../services/sidecart.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-sidecart',
  templateUrl: './sidecart.component.html',
  styleUrls: ['./sidecart.component.css']
})
export class SidecartComponent {
  direction:string='right';
  show:boolean=false;
  constructor(private cartService:CartService){
    this.cartService.sideCart.asObservable().subscribe((data:any)=>{
        this.show=data;
    })
  }

  ChangeHanlder(event:any){
    this.show=event;
  }

}




