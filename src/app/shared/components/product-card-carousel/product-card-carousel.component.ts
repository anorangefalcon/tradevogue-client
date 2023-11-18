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

  @Input() whatToFetch: any = {
    sort: 'highlight:-1'
  };
  @Input() titles: any = {
    title: 'Popular Products',
    subTitle: 'Explore our most demanded products.'
  };    
  
  productArr: productData[] = [];
  
  constructor(private fetchDataService: FetchDataService) {}

  ngOnInit(){
    this.fetchDataService.getProducts(this.whatToFetch, 10).subscribe((data:any)=>{
      console.log("hightl", data);
      this.productArr = data.items;
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
      940: {
        items: 5
      },
      1450: {
        items: 4
      }
    }
  }
  

}
