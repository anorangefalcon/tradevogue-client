import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PipesPipe } from '../checkout/billing/pipes.pipe';
const routers: Routes = [
  { path: '', component: CheckoutComponent },

];

@NgModule({
  declarations: [
    CheckoutComponent,
    CartComponent,
    BillingComponent,
    PipesPipe,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routers),
  ]
})
export class CheckoutModule { }
