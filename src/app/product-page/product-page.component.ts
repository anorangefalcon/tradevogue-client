import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { CartService } from '../shared/services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit{
  data: any = {
    productDetails: {},
    avgRating: 0,
    checkSelect:false,
    offerPercentage: 0
  }

  cartStorage: any[] = [];
  selectedSize: string = "";
  selectedColor: string = "";
  selectedQ: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fetchService: FetchDataService,
    private cartService: CartService
  ) { }

   breadcrumbs: { label: string; url: string }[] = [];

  ngOnInit(): void {
    this.data.productDetails.info = [];
    this.data.productDetails.reviews = [];
    this.route.params.subscribe(params => {
      const sku = params['sku'];
      
      
      this.fetchService.getData().subscribe((data: any[]) => {
        this.data.productDetails = data.find((item) => {
          return item['sku'] === sku;
        });
        this.data.avgRating = 0;
        for (let i = 0; i < (this.data.productDetails.reviews).length; i++) {
          this.data.avgRating += this.data.productDetails.reviews[i].rating;
        }
        this.data.avgRating = this.data.avgRating / this.data.productDetails.reviews.length;
        if (this.data.productDetails.oldPrice !== (undefined || 0)) {
          this.data.offerPercentage = Math.floor((this.data.productDetails.oldPrice - this.data.productDetails.price) / this.data.productDetails.oldPrice * 100);
        }
      });
    });
    
  }

  showCarousel: boolean = false;


  addToCart() {
    const cartItem = {
      sku: this.data.productDetails.sku,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.selectedQ
    }

    this.cartService.addToCart(cartItem);
  }


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    autoplay: true,
    navText: ['<span class="material-symbols-outlined">chevron_left</span>', '<span class="material-symbols-outlined">chevron_right</span>'],
    navSpeed: 600,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
  }

  showZoomedCarousel(image: any) {
    this.showCarousel = true;
    this.zoomCarouselOptions.startPosition = image;
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.showCarousel === true) {
      this.showCarousel = false;
    }
  }


  zoomCarouselOptions: OwlOptions = {
    loop: false,
    rewind: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    autoplay: false,
    navText: ['<span class="material-symbols-outlined">chevron_left</span>', '<span class="material-symbols-outlined">chevron_right</span>'],
    navSpeed: 600,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
  }



  // for Product Details:

  addReview: boolean = false;
  selectedSection = 'description';

  tempUserRating: number = -1;
  userRating: number = -1;

  createArrayToIterate(num: number) {
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

  updateSelectedField(e: any){
    this.selectedQ = e;
  }

}
