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
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { CouponsComponent } from './coupons/coupons.component';
import { PaginationService } from '../shared/services/pagination.service';
import { PopUpComponent } from '../shared/pop-up/pop-up.component';
import { PopupService } from '../shared/services/popup.service';
import { SupportComponent } from './support/support.component';
import { TicketsComponent } from './tickets/tickets.component';
import { DateDisplayPipe } from '../shared/Pipe/date-display.pipe';
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
    FaqsComponent,
    ProductOverviewComponent,
    CouponsComponent,
    SupportComponent,
    TicketsComponent,
    DateDisplayPipe
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    UploadExcelService,
    NgModel,
    PaginationService,
    PopupService
    ],
})
export class DashboardModule { }
