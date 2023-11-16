import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
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
  selectedItem: boolean = false;

  constructor(private cartService: CartService, private popupService: PopupService, private wishlistService : WishlistService) {    
   }

  avgRating: number = 0;
  productData: any = [];
  offerPercentage: number = 0;
  selectedColor: string = "";

  ngOnInit(): void {
    const sku = this.product.sku;
    this.avgRating = this.product.avgRating;
  }

  createArrayToIterate(num: number){
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
    if(!event){
      this.wishlistService.ShowWishlist(this.product._id);
    }
    else{
      this.wishlistService.removeFromWishlist(this.product._id).subscribe((data)=>{        
      });
    }
  }

  
  addToCart(){
    console.log(this.product);
    
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
      this.popupService.openPopup();
      this.showPopup = true;
    }

}
