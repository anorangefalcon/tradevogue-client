import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../shared/services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishlistService } from '../shared/services/wishlist.service';
import { ReviewService } from './services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../shared/services/toast.service';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  @Input() productSku: any = '';

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
  sku: any = "";
  fetchSimilarProducts: any = {};
  carouselTitles: any = {
    title: 'Similar Products',
    subTitle: 'Explore our most similar products.'
  };
  outOfStock: boolean = false;
  loading: boolean = false;

  ratingForm!: FormGroup;
  userReview: any;
  params: HttpParams = new HttpParams().set("sku", this.sku);
  query: any = this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductUrl, this.params);

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
      console.log("HELLO");
      this.sku = this.productSku;
      this.fetchProductData();
    }
    else {
      this.route.params.subscribe(params => {
        this.sku = params['sku'];
        this.fetchProductData();
      });
    }

  }

  fetchProductData() {
    this.loading = true;
    let params = new HttpParams();
    params = params.set("sku", this.sku);

    if (this.productSku) {
      this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductDetails, params).subscribe((data: any) => {
        this.updateDataFields(data);
      });
    }
    else {
      this.fetchService.HTTPGET(this.backendUrl.URLs.fetchProductUrl, params).subscribe((data: any) => {
        this.wishlistService.WishListedProducts.subscribe((response: any) => {
          if (response.includes(data._id)) {
            data.wishlisted = true;
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

    this.outOfStock = (this.data.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;


    // if this user has already reviewed:
    if (data.userReview) {
      this.userReview = data.userReview;
      this.userRating = data.userReview.rating - 1;
      this.ratingForm.setValue({
        rating: data.userReview.rating,
        review: data.userReview.comment
      })
    }
    this.fetchSimilarProducts = {
      'tags': this.data.info.tags
    };
    this.loading = false;
  }

  addToCart() {
    const cartItem = {
      sku: this.data.sku,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.selectedQ
    }

    this.outOfStock = (this.data.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;
    if (this.outOfStock) {
      this.toastService.errorToast({
        title: "This Product is out of stock"
      });
    }
    else {
      this.cartService.addToCart(cartItem);
    }
  }

  changeColor(index: any) {
    this.assetIndex = index;
    this.sizeIndex = 0;
    this.normalizeSizeColorQuantity();
  }

  updateSizeIndex(index: number) {
    this.sizeIndex = index;
    this.normalizeSizeColorQuantity();
  }

  normalizeSizeColorQuantity() {
    this.selectedColor = this.data.assets[this.assetIndex].color;
    this.selectedSize = this.data.assets[this.assetIndex].stockQuantity[this.sizeIndex].size;
    this.outOfStock = (this.data.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;

   
    
    if (!(this.getOrderQuantity().includes(this.selectedQ))) this.selectedQ = 0;
  }

  chooseWishlist() {
    this.wishlistService.ShowWishlist(this.data._id);
  }



  RemoveOrAddToWishlist(event: any = null) {
    if (!event) {
      this.wishlistService.ShowWishlist(this.data._id);
    }
    else {
      this.wishlistService.removeFromWishlist(this.data._id).subscribe((data) => {
        this.wishlistService.getWishlistCount();
        this.data.wishlisted = false;
      });
    }
  }



  getOrderQuantity() {
    let limit = this.data.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity;
    let arr = this.data.info.orderQuantity;
    let filteredArray = arr.filter((item: any) => item <= limit);

    if (!(filteredArray.includes(limit)) && (arr[arr.length - 1] > limit)) {
      filteredArray.push(limit);
    }

    return filteredArray;
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
      this.fetchProductData();
      this.showReview = false;
      this.toastService.successToast({
        title: 'Review successfully ' + (this.userReview ? 'updated' : 'posted')
      });
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.data._id).subscribe((data: any) => {
      this.userReview = '';
      this.fetchProductData();
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