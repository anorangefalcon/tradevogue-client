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
import { ExcelComponent } from './excel/excel.component';
import { NoPageComponent } from './no-page/no-page.component';
import { ProductSectionComponent } from './product-page/product-section/product-section.component';
import { ProductDetailsComponent } from './product-page/product-details/product-details.component';
const routes: Routes = [

  {
    path: '', component: LayoutComponent, data: { breadcrumb: 'Home' },
    children: [
      { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
      {
        path: 'setting', component: SettingsComponent, data: { breadcrumb: 'Setting' }
      },
      { path: 't&c', component: TcComponent, data: { breadcrumb: 'Term & Condition' } },
      { path: 'faq', component: FaqPageComponent, data: { breadcrumb: 'Faq' } },
      {
        path: 'product/:sku',
        component: ProductPageComponent,
        data: { breadcrumb: null },
        children: [
          { path: '', component: ProductSectionComponent, data: { breadcrumb: 'Product Section' } },
        ]
      },
      { path: 'about', component: AboutPageComponent, data: { breadcrumb: 'About' } },
      { path: 'explore', component: ExploreComponent, data: { breadcrumb: 'Explore' } },
      {
        path: 'cart',
        component: CheckoutComponent,
        data: { breadcrumb: 'Cart' },
        children: [
          { path: '', component: CartComponent, data: { breadcrumb: 'Cart' } },
          { path: 'billing', component: BillingComponent, data: { breadcrumb: 'Billing' } }
        ]
      },

    ]
  },
  { path: 'help', component: HelpPageComponent, data: { breadcrumb: 'Help' } },

  {
    path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard', data: { breadcrumb: 'Dashboard' }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },

  {
    path: 'excel', component: ExcelComponent, data: { breadcrumb: 'Excel' },
  },
  {
    path: '**', component: NoPageComponent, data: { breadcrumb: '404' },
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
