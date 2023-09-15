import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { SharedModule } from '../shared/shared.module';
import { AddproductComponent } from './addproduct/addproduct.component';
import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddproductfeaturesComponent } from './addproductfeatures/addproductfeatures.component';
import { UploadExcelService } from './services/upload-excel.service';

@NgModule({
  declarations: [
    DashboardComponent,
    StatisticsComponent,
    ProductsComponent,
    // FilterPipe,
    OrdersComponent,
    AddproductComponent,
    AccountComponent,
    AddproductfeaturesComponent
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  providers: [
    UploadExcelService
  ],
})
export class DashboardModule { }
