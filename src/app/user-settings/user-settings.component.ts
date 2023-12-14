import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {

  constructor(private router:Router){
    if(window.innerWidth>800){
      this.router.navigate(['/user-settings/profile']);
    }
    // else{
    //   this.router.navigate(['/user-settings']);
    // }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if(event.target.innerWidth>800){
      this.router.navigate(['/user-settings/profile']);
      return;
    }
    else{
      this.router.navigate(['/user-settings']);
    }
    
  }

  navitems = [
    { name: 'Profile', icons: 'person', route: '/user-settings/profile' },
    { name: 'Orders', icons: 'package_2', route: '/user-settings/orders' },
    { name: 'Address', icons: 'home', route: '/user-settings/address' },
    { name: 'Wishlist', icons: 'favorite', route: '/user-settings/wishlist' },
    { name: 'Security', icons: 'key', route: '/user-settings/security' },
  ]

}
