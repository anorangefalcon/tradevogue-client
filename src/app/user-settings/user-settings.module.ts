import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { AddressComponent } from './address/address.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { SecurityComponent } from './security/security.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserSettingsComponent,
    ProfileComponent,
    OrdersComponent,
    AddressComponent,
    WishlistsComponent,
    SecurityComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserSettingsModule { }
