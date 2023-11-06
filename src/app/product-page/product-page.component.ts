 import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchDataService } from '../faq-page/fetch-data.service';
import { CartService } from '../shared/services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../shared/services/wishlist.service';
import { ReviewService } from './services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../shared/services/toast.service';
import { UtilsModule } from '../utils/utils.module';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  @Input() productSku: any;

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
  isWishlisted: boolean = false;
  isLogin: boolean = false;
  sku: any = ""

  ratingForm!: FormGroup;
  userReview: any;
  query: any = this.fetchService.getProductDetails(this.sku);

  constructor(
    private route: ActivatedRoute,
    private fetchService: FetchDataService,
    private backendUrl: UtilsModule,

    private cartService: CartService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private toastService: ToastService) {

    this.ratingForm = this.fb.group({
      rating: ['', Validators.required],
      review: ['', Validators.required]
    })

  }

  breadcrumbs: { label: string; url: string }[] = [];

  ngOnInit(): void {

    if (this.productSku) {
      this.sku = this.productSku;
      
      this.fetchProductData();
    }

    this.fetchProductDatabyRoute();
  }

  fetchProductDatabyRoute() {
    this.route.params.subscribe(params => {
      this.sku = params['sku'];
      this.fetchProductData();

    });
  }

  async fetchProductData() {

    if(this.productSku){
      this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductDetails, this.sku, 'data').subscribe((data: any)=>{
        console.log(data);

        this.updateDataFields(data);
      })
    }else{
      this.fetchService.getProductDetails(this.sku).subscribe((data: any) => {
        console.log(data);
        this.wishlistService.WishListedProducts.subscribe((response:any)=>{
              if(response.includes(data._id)){
                data.wishlisted=true;
              } 
            })
        this.updateDataFields(data);
      });
    }
  }

  updateDataFields(data: any) {
    this.data = data;
    this.data.avgRating = data.avgRating ? data.avgRating : 0;
    this.activeIndex = 0;
    this.selectedColor = data.assets[0].color;
    this.selectedSize = data.assets[this.assetIndex].stockQuantity[0].size;

    // if this user has already reviewed:
    if (data.userReview) {
      this.userReview = data.userReview;
      this.userRating = data.userReview.rating - 1;
      this.ratingForm.setValue({
        rating: data.userReview.rating,
        review: data.userReview.comment
      })
    }
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

  chooseWishlist() {    
    this.wishlistService.ShowWishlist(this.data._id);    
  }
  
  LabelClicked(event: any) {
    console.log('event is ', event.target.value);
  }

  selectedSection = 'description';
  tempUserRating: number = -1;
  userRating: number = -1;

  RatingUpdated() {
    this.ratingForm.controls['rating'].setValue(this.userRating + 1);
  }

  addOrUpdateReview() {
    let review = {
      productId: this.data._id,
      rating: this.ratingForm.controls['rating'].value,
      comment: this.ratingForm.controls['review'].value
    }

    this.reviewService.addReview(review).subscribe(() => {     
      this.fetchProductDatabyRoute();
      this.showReview = false;
      this.toastService.successToast({
        title: 'Review successfully ' + (this.userReview ? 'updated' : 'posted')
      });
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.data._id).subscribe((data: any) => {
      console.log(data.message);
      this.userReview = '';
      this.fetchProductDatabyRoute();
      this.toastService.notificationToast({
        title: 'Review deleted successfully'
      });
    });
  }

  scroll(element: HTMLElement) {
    var headerOffset = 250;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

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

  updateSizeIndex(index: number) {
    this.sizeIndex = index;
  }

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

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'Escape' && this.showCarousel === true) {
  //     this.showCarousel = false;
  //   }
  // }
}