import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { EyePopService } from '../../services/eye-pop.service';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {

  @Input() product: any = {};
  assetIndex: any = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService,
    private wishlistService: WishlistService,
    private eyePopupService: EyePopService) {

    }

  avgRating: number = 0;
  offerPercentage: number = 0;

  ngOnInit(): void {
    this.avgRating = this.product.avgRating;
    if(this.product.matchedIndex) this.assetIndex = this.product.matchedIndex;

    this.wishlistService.WishListedProducts.subscribe((response:any)=>{  
      if(response.includes(this.product._id)){
        this.product.wishlisted=true;
      } 
      else{
        this.product.wishlisted=false;
      }
    })

    let limit = this.product.assets[0].stockQuantity[0].quantity;
    let arr = this.product.info.orderQuantity;
    let filteredArray = arr.filter((item: any) => item <= limit);

    if (!(filteredArray.includes(limit)) && (arr[arr.length - 1] > limit)) {
      filteredArray.push(limit);
    }

    // this.productPageService.orderQuantity.next(filteredArray);
    this.product.info.orderQuantity = filteredArray;
  }

  currentIndex = 0;
  tagsToShow = 3;
  slicedTags: string[] = [];

  createArrayToIterate(num: number) {
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

  chooseWishlist() {
    this.wishlistService.ShowWishlist(this.product._id);
  }

  RemoveOrAddToWishlist(event:any=null){
    console.log(this.product, "which product");
    
    if(!event){
      this.wishlistService.ShowWishlist(this.product._id);
    }
    else{
      this.wishlistService.removeFromWishlist(this.product._id).subscribe((data)=>{  
        this.wishlistService.getWishlistCount();
        this.product.wishlisted = false;
      });
    }
  }

  addToCart() {
    if (this.product.assets[0].stockQuantity[0].quantity <= 0) {
      this.toastService.errorToast({ title: 'Please select other variant of this product as it is outofStock' });
      this.router.navigate(['product/' + this.product.sku]);
      return;
    }
    const cartItem = {
      sku: this.product.sku,
      color: this.product.assets[0].color,
      size: this.product.assets[0].stockQuantity[0].size,
      quantity: this.product.info.orderQuantity[0]
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

  openPopup() {
    // this.eyePopupService.showEyePopup.next(true);
    this.eyePopupService.ShowEyelist(this.product.sku);
  }

}
