import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { TcComponent } from './tc/tc.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './checkout/cart/cart.component';
import { BillingComponent } from './checkout/billing/billing.component';
import { ExploreComponent } from './explore/explore.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { SettingsComponent } from './settings/settings.component';
const routes: Routes = [

  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
    path: 'setting', component:SettingsComponent
  },
      { path: 't&c', component: TcComponent },
      { path: 'faq', component: FaqPageComponent },
      { path: 'product/:sku', component: ProductPageComponent },
      { path: 'about', component: AboutPageComponent },
      { path: 'explore', component: ExploreComponent },
      {
        path: 'cart', component: CheckoutComponent,
        children: [
          { path: '', component: CartComponent },
          { path: 'billing', component: BillingComponent }
        ]
      },
    ]
  },
  {path: 'help', component: HelpPageComponent},

  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
