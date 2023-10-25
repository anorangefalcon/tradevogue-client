import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
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
import { environment } from 'src/environments/environment';
// import { initializeApp } from 'firebase/app';
// initializeApp(environment.firebase);
import { WishlistComponent } from './wishlist/wishlist.component';
// import { DrawerComponent } from './drawer/drawer.component';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FcmPushService } from './shared/services/fcm-push/fcm-push.service';
import { FirebaseAuthService } from './shared/services/firebase-auth/firebase-auth.service';
initializeApp(environment.firebase);

export const firebaseConfig = {
  apiKey: "AIzaSyDL6i90M0cXcKX9B-Rq3wIKLidsaaMz86g",
  authDomain: "tradevogue.firebaseapp.com",
  projectId: "tradevogue",
  storageBucket: "tradevogue.appspot.com",
  messagingSenderId: "271891465540",
  appId: "1:271891465540:web:674972c835685b5b5ac311",
}



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
    // DrawerComponent, 
  ],
  imports: [
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
    UtilsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    
  ],
  providers: [
    CookieService,
    FirebaseAuthService,
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    
  }
}
