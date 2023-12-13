import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { SecurityComponent } from './security/security.component';
import { AddressComponent } from './address/address.component';
import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
  {
    path: '', component: UserSettingsComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'address', component: AddressComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'wishlist', component: WishlistsComponent },
      { path: 'security', component: SecurityComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
