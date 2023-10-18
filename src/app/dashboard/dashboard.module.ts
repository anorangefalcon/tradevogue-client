import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
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
import { OrderPageComponent } from './orders/order-page/order-page.component';
import { FaqsComponent } from './faqs/faqs.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StatisticsComponent,
    ProductsComponent,
    // FilterPipe,
    OrdersComponent,
    AddproductComponent,
    AccountComponent,
    AddproductfeaturesComponent,
    OrderPageComponent,
    FaqsComponent
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    UploadExcelService,
    NgModel
  ],
})
export class DashboardModule { }
