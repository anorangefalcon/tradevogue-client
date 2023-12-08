import { Component, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FetchDataService } from '../../services/fetch-data.service';
import { productData } from '../../productData';

@Component({
  selector: 'app-product-card-carousel',
  templateUrl: './product-card-carousel.component.html',
  styleUrls: ['./product-card-carousel.component.css'],
})
export class ProductCardCarouselComponent {

  @Input() whatToFetch: any = {
    sort: 'highlight:-1'
  };
  @Input() titles: any = {
    title: 'Popular Products',
    subTitle: 'Explore our most demanded products.'
  };
  @Input() excludeSKU: String = '';
  
  productArr: productData[] = [];
  
  constructor(private fetchDataService: FetchDataService) {}

  ngOnInit(){
    this.fetchDataService.getProducts(this.whatToFetch, 10).subscribe((data:any)=>{
      this.productArr = data.items;

      if(this.excludeSKU){
        console.log(this.excludeSKU);
        
        this.productArr = this.productArr.filter((item: any) => item.sku !== this.excludeSKU);
      }
    })
  }

  customOptions: OwlOptions = {
    loop: false,
    rewind: true,
    margin: 15,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    navSpeed: 300,
    nav: this.productArr.length > 5 ? true : false,
    navText: [
      '<span class="material-symbols-outlined custom-nav-btn">navigate_before</span>',
      '<span class="material-symbols-outlined custom-nav-btn">navigate_next</span>'
    ],
    responsive: {
      0: {
        items: 1
      },
      340: {
        items: 2
      },
      500: {
        items: 3
      },
      740: {
        items: 4,
        margin: 20,
      },
      940: {
        items: 5,
        margin: 20,
      }
    }
  }
  

}