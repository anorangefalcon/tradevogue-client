import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { HomeComponent } from './home/home.component';
import { HeroComponent } from './home/hero/hero.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { DashboardComponent } from './dashboard/home.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { CardTemplateComponent } from './shared/components/card-template/card-template.component';
import { AboutPageComponent } from './about-page/about-page.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'hero', component: HeroComponent},
      { path : 'card', component: CardTemplateComponent}
    ]
  },

  {
    path: 'auth', component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
    ]
  },

  { path: 'dashboard' , component: DashboardComponent,
    children: [
      { path: '', component: StatisticsComponent},
      { path: 'products', component: ProductsComponent},
      { path: 'orders', component: OrdersComponent}
    ]
  },



  //ABOUT PAGE PATH
  {path:'about',component:AboutPageComponent}

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
