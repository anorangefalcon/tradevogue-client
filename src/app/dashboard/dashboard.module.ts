import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
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
// import { PaginationService } from '../shared/services/pagination.service';
import { PopupService } from '../shared/services/popup.service';
import { SupportComponent } from './support/support.component';
import { TicketsComponent } from './tickets/tickets.component';
import { DateDisplayPipe } from '../shared/Pipe/date-display.pipe';
import { ProductPageModule } from '../product-page/product-page.module';
import { SocialsComponent } from './socials/socials.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { SalesComponent } from './edit-home/sales/sales.component';
import { GalleryComponent } from '../home/gallery/gallery.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AboutComponent } from './about/about.component';
import { CustomiseTcComponent } from './customise-tc/customise-tc.component';
import { ChatComponent } from './chat/chat.component';
import { OffersComponent } from './offers/offers.component';
import { ImageTransformPipe } from '../shared/Pipe/image-transform.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    StatisticsComponent,
    ProductsComponent,
    OrdersComponent,
    AddproductComponent,
    AccountComponent,
    AddproductfeaturesComponent,
    OrderPageComponent,
    FaqsComponent,
    ProductOverviewComponent,
    SupportComponent,
    TicketsComponent,
    DateDisplayPipe,
    SocialsComponent,
    MonetizationComponent,
    SalesComponent,
    NotificationsComponent,
    AboutComponent,
    CustomiseTcComponent,
    ChatComponent,
    OffersComponent,

  ],

  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ProductPageModule,
    GalleryComponent,
    RouterModule,
    ImageTransformPipe
  ],
  providers: [
    UploadExcelService,
    NgModel,
    // PaginationService,
    PopupService,
    DatePipe
  ],
})

export class DashboardModule { }
