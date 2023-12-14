import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { ProductPageModule } from './product-page/product-page.module';
import { FaqPageModule } from './faq-page/faq-page.module';
import { CheckoutModule } from './checkout/checkout.module';
import { UtilsModule } from './utils/backend-urls';
import { CookieService } from 'ngx-cookie-service';
import { HeadersInterceptor } from './headers.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { TcComponent } from './tc/tc.component';
import { ExploreComponent } from './explore/explore.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { NoPageComponent } from './no-page/no-page.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { ToastComponent } from './toast/toast.component';
import { SidecartComponent } from './shared/sidecart/sidecart.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MessagingService } from './shared/services/messaging-service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutComponent } from './about/about.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const config: SocketIoConfig = { url: 'http://localhost:1000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TcComponent,
    ExploreComponent,
    HelpPageComponent,
    NoPageComponent,
    BreadcrumbComponent,
    ToastComponent,
    SidecartComponent,
    DialogBoxComponent,
    WishlistComponent,
    AboutComponent
  ],
  imports: [
    CarouselModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    ProductPageModule,
    FaqPageModule,
    CheckoutModule,
    HttpClientModule,
    UtilsModule,
    SocketIoModule.forRoot(config),
  ],
  exports: [
  ],
  providers: [
    CookieService,
    MessagingService, AsyncPipe,
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}