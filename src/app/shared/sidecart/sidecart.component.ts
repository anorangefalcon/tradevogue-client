import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidecart',
  templateUrl: './sidecart.component.html',
  styleUrls: ['./sidecart.component.css']
})
export class SidecartComponent {
  direction: string = 'right';
  show: boolean = false;
  totalAmt: Number = 0;
  allSubscriptions: Subscription[] = [];

  constructor(private cartService: CartService, private router: Router) {
    this.allSubscriptions.push(
      this.cartService.sideCart.asObservable().subscribe((data: any) => {
        this.show = data;
      }));

    this.allSubscriptions.push(
      this.cartService.fetchCart('amount').subscribe((amount: any) => {
        if (amount?.total === 0) {
          this.show = false
        }
        this.totalAmt = amount?.total;
      }));
  }

  ChangeHanlder(event: any) {
    this.show = event;
  }

  proceedToCart() {
    this.show = false;
    this.router.navigate(['/cart']);
  }

  ngOnDestroy() {
    this.allSubscriptions.forEach((item: Subscription) => item.unsubscribe());
  }
}