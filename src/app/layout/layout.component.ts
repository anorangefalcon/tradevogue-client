import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  ShowNavBar:boolean=true;
  constructor(private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/cart/billing' ) {
          this.ShowNavBar = false;
        }
        else{
          this.ShowNavBar = true;
        }
      }
    })
  }

}
