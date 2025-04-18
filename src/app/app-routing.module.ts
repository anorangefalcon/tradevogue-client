import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { TcComponent } from './tc/tc.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './checkout/cart/cart.component';
import { BillingComponent } from './checkout/billing/billing.component';
import { ExploreComponent } from './explore/explore.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { NoPageComponent } from './no-page/no-page.component';
import { authGuard } from './auth.guard';
import { AboutComponent } from './about/about.component';
import { redirectGuard } from './checkout/redirect.guard';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, data: { breadcrumb: 'Home' },
    children: [
      { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
      { path: 't&c', component: TcComponent, data: { breadcrumb: 'Term & Condition' } },
      { path: 'faq', component: FaqPageComponent, data: { breadcrumb: 'Faq' } },
      { path: 'help', component: HelpPageComponent, data: { breadcrumb: 'Help' } },
      {
        path: 'product/:sku',
        component: ProductPageComponent,
        data: { breadcrumb: 'Product' }
      },
      { path: 'about', component: AboutComponent, data: { breadcrumb: 'About' } },
      { path: 'explore', component: ExploreComponent, data: { breadcrumb: 'Explore' }},
      {
        path: 'cart',
        component: CheckoutComponent,
        data: { breadcrumb: 'Cart' },
        children: [
          { path: '', component: CartComponent, data: { breadcrumb: 'Cart' } },
          { path: 'billing', component: BillingComponent, data: { breadcrumb: 'Billing' }, canDeactivate: [redirectGuard],canActivate:[authGuard] }
        ]
      },
      {
        path : 'user-settings',
        loadChildren : () => import('./user-settings/user-settings.module').then(m => m.UserSettingsModule)
      }
    ]
  },
  {
    path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),canActivate: [authGuard]
    
  },
  {
    path: '**', component: NoPageComponent, data: { breadcrumb: '404' } 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    // RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }