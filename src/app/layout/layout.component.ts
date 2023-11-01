import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  ShowNavBar:boolean=true;
  constructor(private router: Router) {
      if(this.router.url=='/cart/billing'){
        this.ShowNavBar=false;
      }
      // console.log('routerurl is ',this.router.url);
      
  }

}
