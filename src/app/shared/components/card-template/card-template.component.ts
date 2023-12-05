import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../services/wishlist.service';
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
    private wishlistService: WishlistService,
    private eyePopupService: EyePopService) {
  }

  avgRating: number = 0;
  offerPercentage: number = 0;

  ngOnInit(): void {
    this.avgRating = this.product.avgRating;
    if (this.product.matchedIndex) this.assetIndex = this.product.matchedIndex;

    this.wishlistService.WishListedProducts.subscribe((response: any) => {
      if (response.includes(this.product._id)) {
        this.product.wishlisted = true;
      }
      else {
        this.product.wishlisted = false;
      }
    })

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

  RemoveOrAddToWishlist(isWishlisted:any = null){    
    if(!isWishlisted){
      this.wishlistService.ShowWishlist(this.product._id);
    }
    else {
      this.wishlistService.removeFromWishlist(this.product._id).subscribe((data) => {
        this.wishlistService.getWishlistCount();
        this.product.wishlisted = false;
      });
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  openPopup(){
    this.eyePopupService.ShowEyelist(this.product.sku);
  }

}
