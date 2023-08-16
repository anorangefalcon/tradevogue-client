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
<<<<<<< Updated upstream
import { TcComponent } from './tc/tc.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ProductPageComponent } from './product-page/product-page.component';

=======
import { FaqPageComponent } from './faq-page/faq-page.component';
>>>>>>> Stashed changes
const routes: Routes = [
  
  {
    path: '', component: LayoutComponent,
    children: [
<<<<<<< Updated upstream
      { path: '', component: HomeComponent},
      { path : 't&c' , component: TcComponent},
      { path : 'faq' , component: FaqPageComponent},
      { path : 'product' , component: ProductPageComponent},
      { path : 'about', component: AboutPageComponent}
=======
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'hero', component: HeroComponent},
      { path : 'card', component: CardTemplateComponent},
      { path : 'faq', component: FaqPageComponent }
>>>>>>> Stashed changes
    ]
  },

  {
    path: '', component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
    ]
  },

  { path: 'dashboard' , component: DashboardComponent,
    children: [
      { path: '', component: StatisticsComponent},
      { path: 'products', component: ProductsComponent},
      { path: 'orders', component: OrdersComponent}
    ]
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
