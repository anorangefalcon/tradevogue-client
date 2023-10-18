import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { AccountComponent } from './account/account.component';
import { AddproductfeaturesComponent } from './addproductfeatures/addproductfeatures.component';
import { OrderPageComponent } from './orders/order-page/order-page.component';
import { FaqsComponent } from './faqs/faqs.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: StatisticsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'addproduct', component: AddproductComponent },
      { path: 'account', component: AccountComponent },
      { path: 'features', component: AddproductfeaturesComponent},
      { path: 'orderDetails/:orderId', component: OrderPageComponent},
      {path: 'faq', component: FaqsComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
