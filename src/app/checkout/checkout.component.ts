import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  inventory_count: number = 0;
  navbar_scroll_style: boolean = false;

  @HostListener('window:scroll', []) onScroll(){
    if(window.scrollY > 80){
      this.navbar_scroll_style = true;
    }else{
      this.navbar_scroll_style = false;
    }
    
  }
}
