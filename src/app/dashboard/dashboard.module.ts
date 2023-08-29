import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './home.component';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { SharedModule } from '../shared/shared.module';
import { AddproductComponent } from './addproduct/addproduct.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidepanelComponent,
    StatisticsComponent,
    ProductsComponent,
    OrdersComponent,
    AddproductComponent,
    AccountComponent
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class DashboardModule { }
