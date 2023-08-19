import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { DashboardComponent } from './dashboard/home.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { TcComponent } from './tc/tc.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddproductComponent } from './dashboard/addproduct/addproduct.component';
import { BillingComponent } from './checkout/billing/billing.component';
import { CartComponent } from './checkout/cart/cart.component';
import { ExploreComponent } from './explore/explore.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent},
      { path : 't&c' , component: TcComponent},
      { path : 'faq' , component: FaqPageComponent, data: { hideFooterFAQ: true } },
      { path : 'product' , component: ProductPageComponent},
      { path : 'about', component: AboutPageComponent},
      { path : 'explore', component: ExploreComponent},
      { path: 'cart', component: CheckoutComponent,
      children:[
       { path: '', component: CartComponent},
       { path: 'billing', component: BillingComponent}
      ]
    },
    ]
  },

  {
    path: '', component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', component: StatisticsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'addproduct', component: AddproductComponent }
    ]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
