import { Component } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-product-cards',
  templateUrl: './product-cards.component.html',
  styleUrls: ['./product-cards.component.css']
})
export class ProductCardsComponent {

  products: any = [];

  constructor(public fetchProducts: FetchDataService){}

  ngOnInit(){
    this.fetchProducts.getProducts('', 5).subscribe((data:any)=>{    
      console.log(data.items);
        
      this.products = data.items;
    })
  }

  customOptions: OwlOptions = {
    loop: false,
    rewind: true,
    margin: 30,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    navSpeed: 300,
    nav: true,
    navText: [
      '<span class="material-symbols-outlined custom-nav-btn">navigate_before</span>',
      '<span class="material-symbols-outlined custom-nav-btn">navigate_next</span>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      1000: {
        items: 4
      },
      1400: {
        items: 4
      }
    }
  }

}
