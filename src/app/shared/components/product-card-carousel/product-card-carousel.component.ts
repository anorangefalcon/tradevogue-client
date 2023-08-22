import { Component, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FetchDataService } from '../../services/fetch-data.service';
import { productData } from '../../productData';

@Component({
  selector: 'app-product-card-carousel',
  templateUrl: './product-card-carousel.component.html',
  styleUrls: ['./product-card-carousel.component.css']
})
export class ProductCardCarouselComponent {

  @Input() whatToFetch: string = '';
  productArr: productData[] = [];
  
  //will fetch ?queryParam according to whatToFetch (but a dummy which gets 10 data from a .json)
  constructor(private fetchDataService: FetchDataService) { 
    this.fetchDataService.getData().subscribe(data => {
      for(let i=0; i<5; i++){
        this.productArr.push(data[i]);
      }
    });
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
      940: {
        items: 4
      }
    }
  }
  

}
