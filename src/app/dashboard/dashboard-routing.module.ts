import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { AccountComponent } from './account/account.component';
import { AddproductfeaturesComponent } from './addproductfeatures/addproductfeatures.component';
import { OrderPageComponent } from './orders/order-page/order-page.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SupportComponent } from './support/support.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SocialsComponent } from './socials/socials.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { NoPageComponent } from '../no-page/no-page.component';
import { CustomBannerComponent } from './custom-banner/custom-banner.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [

      { path: 'overview', component: StatisticsComponent },

      { path: 'products', component: ProductsComponent },
      { path: 'features', component: AddproductfeaturesComponent },
      { path: 'product-overview/:sku', component: ProductOverviewComponent },
      { path: 'addproduct', component: AddproductComponent },
      { path: 'editproduct/:sku', component: AddproductComponent },

      { path: 'orders', component: OrdersComponent },
      { path: 'orderDetails/:orderId', component: OrderPageComponent },

      { path: 'account', component: AccountComponent },

      { path: 'faq', component: FaqsComponent },
      { path: 'coupons', component: CouponsComponent },
      { path: 'support', component: SupportComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'monetization', component: MonetizationComponent },
      { path: 'socials', component: SocialsComponent },
      { path: 'customise-banner', component: CustomBannerComponent},

      { path: '**', component: NoPageComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
