import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductPageModule } from './product-page/product-page.module';
import { FaqPageModule } from './faq-page/faq-page.module';
import { CheckoutModule } from './checkout/checkout.module';
import { UtilsModule } from './utils/utils.module';
import { CookieService } from 'ngx-cookie-service';
import { HeadersInterceptor } from './headers.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { TcComponent } from './tc/tc.component';
import { ExploreComponent } from './explore/explore.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { SettingsComponent } from './settings/settings.component';
import { NoPageComponent } from './no-page/no-page.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { ToastComponent } from './toast/toast.component';
import { SidecartComponent } from './shared/sidecart/sidecart.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MessagingService } from './shared/services/messaging-service';
import { OffersCarouselComponent } from './offers-carousel/offers-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TcComponent,
    ExploreComponent,
    HelpPageComponent,
    SettingsComponent,
    NoPageComponent,
    BreadcrumbComponent,
    ToastComponent,
    SidecartComponent,
    DialogBoxComponent,
    WishlistComponent,
    OffersCarouselComponent,
    AboutComponent,
  ],
  imports: [
    CarouselModule,
    BrowserModule,
    CommonModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    DashboardModule,
    DataTablesModule,
    ProductPageModule,
    FaqPageModule,
    CheckoutModule,
    HttpClientModule,
    UtilsModule
  ],
  exports: [
  ],
  providers: [
    CookieService,
    MessagingService, AsyncPipe,
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}