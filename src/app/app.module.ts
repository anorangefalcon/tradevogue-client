import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { LayoutComponent } from './layout/layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';
import { DataTablesModule } from 'angular-datatables';
import { ProductPageModule } from './product-page/product-page.module';
import { FaqPageModule } from './faq-page/faq-page.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TcComponent } from './tc/tc.component';
import { CheckoutModule } from './checkout/checkout.module';
import { ExploreComponent } from './explore/explore.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HelpPageComponent } from './help-page/help-page.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { NoPageComponent } from './no-page/no-page.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { ToastComponent } from './toast/toast.component';
import { CookieService } from 'ngx-cookie-service';
import { HeadersInterceptor } from './headers.interceptor';
import { SidecartComponent } from './shared/sidecart/sidecart.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { WishlistComponent } from './wishlist/wishlist.component';


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
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    ReactiveFormsModule,
    DashboardModule,
    FormsModule,
    DataTablesModule,
    ProductPageModule,
    FaqPageModule,
    CheckoutModule,
    HttpClientModule, 
     
  ],
  providers: [CookieService,
    {provide: HTTP_INTERCEPTORS, useClass:HeadersInterceptor, multi: true},],

  bootstrap: [AppComponent]
})
export class AppModule { }
