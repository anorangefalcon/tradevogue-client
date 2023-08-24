import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  inventory_count: number = 0;
  navbar_scroll_style: boolean = false;

  @HostListener('window:scroll', []) onScroll(){
    if(window.scrollY > 40){
      this.navbar_scroll_style = true;
    }else{
      this.navbar_scroll_style = false;
    }
    
  }

}
