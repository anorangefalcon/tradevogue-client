import { Component } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {

  navitems = [
    { name: 'Profile', icons: 'person', route: '/user-settings' },
    { name: 'Orders', icons: 'package_2', route: '/user-settings/orders' },
    { name: 'Address', icons: 'home', route: '/user-settings/address' },
    { name: 'Wishlist', icons: 'favorite', route: '/user-settings/wishlist' },
    { name: 'Security', icons: 'key', route: '/user-settings/security' },
  ]
}
