import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { CartService } from '../shared/services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  data: any = null;

  cartStorage: any[] = [];
  selectedSize: string = "";
  selectedColor: string = "";
  selectedQ: number = 0;
  showReview: boolean = false;
  activeIndex: number = 0;
  accordianOpen: boolean = false;
  accordianOpen2: boolean = true;
  assetIndex: any = 0;
  sizeIndex: any = 0;


  constructor(
    private route: ActivatedRoute,
    private fetchService: FetchDataService,
    private cartService: CartService
  ) { }

  breadcrumbs: { label: string; url: string }[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const sku = params['sku'];
      this.fetchService.getProductDetails(sku).subscribe((data: any) => {
        this.data = data;
        console.log(data);
        this.data.avgRating = data.avgRating;
        this.activeIndex = 0;
        this.selectedColor = data.assets[0].color;
        this.selectedSize = data.assets[this.assetIndex].stockQuantity[0].size;
      });

    });
  }

  addToCart() {
    const cartItem = {
      sku: this.data.sku,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.selectedQ
    }

    this.cartService.addToCart(cartItem);
  }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'Escape' && this.showCarousel === true) {
  //     this.showCarousel = false;
  //   }
  // }

  customOptions: OwlOptions = {
    startPosition: 0,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    items: 1,
    autoplay: false,
    // navText: ['<span class="material-symbols-outlined">chevron_left</span>', '<span class="material-symbols-outlined">chevron_right</span>'],
    navText: ['', ''],
    navSpeed: 600,
    // responsive: {
    //   0: {
    //     items: 1
    //   },
    //   400: {
    //     items: 1
    //   },
    //   740: {
    //     items: 1
    //   },
    //   940: {
    //     items: 1
    //   }
    // },
  }
  carouselOption: OwlOptions = this.customOptions;
  atDefault: boolean = true;

  switchImage(image: number) {
    this.activeIndex = image;
    this.customOptions.startPosition = image;
    this.carouselOption = JSON.parse(JSON.stringify(this.customOptions));
    this.atDefault = !this.atDefault;
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

  updateSelectedField(e: any) {
    this.selectedQ = e;
  }

  updateSizeIndex(index: number){
    this.sizeIndex = index;
  } 

}
