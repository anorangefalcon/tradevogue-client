import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SidecartService } from '../../services/sidecart.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { PopupService } from '../../services/popup.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {
  
  @Input() product: any = {};
  showPopup: boolean = false;


  constructor(private cartService: CartService, private sideCartService: SidecartService, private fetchdata: FetchDataService, private popupService: PopupService, private wishlist : WishlistService) { }

  avgRating: number = 0;
  productData: any = [];
  offerPercentage: number = 0;
  selectedColor: string = "";

  ngOnInit(): void {

    this.avgRating = this.product.avgRating;

    const sku = this.product.sku;
    this.fetchdata.getProductDetails(sku).subscribe((data: any) => {
      this.productData = data;
      // console.log(this.productData);
    })
    
    this.product.oldPrice = 0; //temp
    // this will be updated once coupon/discount backend is done
    // if (this.product.oldPrice !== (undefined || 0)) {
      // this.offerPercentage = Math.floor((this.product.oldPrice- this.product.price) / this.product.oldPrice * 100);
    // }

    const allSkeleton = document.querySelectorAll('.skeleton');

    window.addEventListener('load', () => {
      allSkeleton.forEach((item: Element) => {
        item.classList.remove('skeleton');
      });
    });

    window.addEventListener('scroll', () => {
      allSkeleton.forEach((item: Element) => {
        item.classList.remove('skeleton')
      })
    })

  }

  createArrayToIterate(num: number){
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

  async addToWishlist() {
    this.wishlist.showWishlist();
  }
  
  addToCart(){
    const cartItem = {
      sku: this.product.sku,
    }
    this.sideCartService.toggleSidecart(true); 
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

  openPopup() {
      this.popupService.openPopup();
      // this.showPopup = true;
    }

}
