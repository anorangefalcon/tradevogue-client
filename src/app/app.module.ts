import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { LayoutComponent } from './layout/layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { DataTablesModule } from 'angular-datatables';
import { ProductPageModule } from './product-page/product-page.module';
import { FaqPageModule } from './faq-page/faq-page.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TcComponent } from './tc/tc.component';
import { CheckoutModule } from './checkout/checkout.module';
import { ExploreComponent } from './explore/explore.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { HelpPageComponent } from './help-page/help-page.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
// import { FilterPipe } from './shared/Pipe/filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AuthLayoutComponent,
    TcComponent,
    ExploreComponent,
    HelpPageComponent,
    SettingsComponent,
    // FilterPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    // AuthModule,
    HomeModule,
    ReactiveFormsModule,
    DashboardModule,
    FormsModule,
    // CarouselModule,
    DataTablesModule,
    ProductPageModule,
    FaqPageModule,
    CheckoutModule,
    MatTabsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
