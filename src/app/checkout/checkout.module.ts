import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { PipesPipe } from '../checkout/billing/pipes.pipe';
import { SharedModule } from '../shared/shared.module';
import { UtilsModule } from '../utils/utils.module';


const routers: Routes = [
  { path: '', component: CheckoutComponent },

];

@NgModule({
  declarations: [
    CheckoutComponent,
    CartComponent,
    BillingComponent,
    PipesPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    UtilsModule,
    SharedModule,
    RouterModule.forChild(routers),
  ]
})
export class CheckoutModule{

}
