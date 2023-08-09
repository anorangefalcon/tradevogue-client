import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './home.component';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidepanelComponent,
    StatisticsComponent,
    ProductsComponent,
    OrdersComponent
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
