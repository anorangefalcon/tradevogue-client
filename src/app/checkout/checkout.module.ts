import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

const routers: Routes = [
  { path: '', component: CheckoutComponent },

];

@NgModule({
  declarations: [
    CheckoutComponent,
    CartComponent,
    BillingComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
  ]
})
export class CheckoutModule { }
