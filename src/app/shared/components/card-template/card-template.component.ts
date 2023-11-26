import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PopupService } from '../../services/popup.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EyePopupComponent } from '../../eye-popup/eye-popup.component';
import { EyePopupService } from '../../services/eye-popup.service';
@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {

  @Input() product: any = {};
  showPopup: boolean = false;
  selectedItem: boolean = false;

  constructor(
    private cartService: CartService,
    private popupService: PopupService,
    private router: Router,
    private toastService: ToastService,
    private eyepopup: EyePopupComponent,
    private wishlistService: WishlistService,
    private eyePopupService: EyePopupService) {
  }

  avgRating: number = 0;
  productData: any = [];
  offerPercentage: number = 0;
  selectedColor: string = "";

  showEyePopup = new BehaviorSubject<any>('');
  eyePopupData = this.showEyePopup.asObservable();

  ngOnInit(): void {
    const sku = this.product.sku;
    this.avgRating = this.product.avgRating;

    let limit = this.product.assets[0].stockQuantity[0].quantity;
    let arr = this.product.info.orderQuantity;
    let filteredArray = arr.filter((item: any) => item <= limit);

    if (!(filteredArray.includes(limit)) && (arr[arr.length - 1] > limit)) {
      filteredArray.push(limit);
    }

    // this.productPageService.orderQuantity.next(filteredArray);
    this.product.info.orderQuantity = filteredArray;
    // console.log(this.product , "product is ");
    this.startRotatingTags();
  }

  currentIndex = 0;
  tagsToShow = 3;
  slicedTags: string[] = [];

  startRotatingTags(): void {
    if (this.product && this.product.info && this.product.info.tags) {
      const productTags = this.product.info.tags;

      setInterval(() => {
        const endIndex = this.currentIndex + this.tagsToShow;
        this.slicedTags = productTags.slice(this.currentIndex, endIndex);
        this.currentIndex = (this.currentIndex + this.tagsToShow) % productTags.length;
      }, 5000); // Change the time interval as needed (in milliseconds)
    }
  }

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
    // console.log('product is ',this.product);
    // return;
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
    this.showEyePopup.next(true);
    this.eyePopupService.showEyePopup.next(true);
    this.eyePopupService.ShowEyelist(this.product.sku);
  }

}
