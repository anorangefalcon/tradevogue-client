import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EyePopService } from '../services/eye-pop.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { HttpParams } from '@angular/common/http';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eye-popup',
  templateUrl: './eye-popup.component.html',
  styleUrls: ['./eye-popup.component.css'],
  // encapsulation: ViewEncapsulation.None 
})
export class EyePopupComponent {
  assetIndex: any = 0;
  sizeIndex: any = 0;
  @Input() productSku: any = '';
  fetchSimilarProducts: any = {};
  direction: any = 'popup';
  width: any = 'fit-content';
  outOfStock: boolean = false;
  show: boolean = false;
  fetchData = new BehaviorSubject<string>('');
  sku: any;
  list: any = [];
  avgRating: number = 0;
  productData: any = [];
  selectedColor: string = "";
  accordianOpen: boolean = false;
  accordianOpen2: boolean = true;
  slicedTags: string[] = [];
  currentIndex = 0;
  tagsToShow = 3;
  selectedSize: string = "";
  selectedQ: any;
  loading: any;
  activeIndex: any;
  private drawerSubscription!: Subscription;

  constructor(private eyePopService: EyePopService,
    private toastService: ToastService,
    private router: Router,
    private cartService: CartService,
    private changeDetector: ChangeDetectorRef,
    private fetchDataService: FetchDataService,
    private backendUrl: UtilsModule,
    private route: ActivatedRoute,) {

  }

  ngOnInit() {
    this.avgRating = this.list.avgRating;
    this.eyePopService.EyePopupData.subscribe((data) => {
      console.log(data, "eye data is ");
      if (!data) return;
      this.list = data;
      this.show = true;
      this.startRotatingTags();
    });
  }

  fetchProductData(loading: boolean = true) {
    this.loading = loading;
    let params = new HttpParams();
    params = params.set("sku", this.sku);
    this.assetIndex = 0;
    this.sizeIndex = 0;

    if (this.productSku) {
      this.fetchDataService.HTTPGET(this.backendUrl.URLs.fetchProductDetails, params).subscribe((data: any) => {
        this.updateDataFields(data);
      });
    }
  }

  updateDataFields(data: any) {
    this.list = data;
    this.list.avgRating = data.avgRating ? data.avgRating : 0;
    this.activeIndex = 0;
    this.selectedColor = data.assets[0].color;
    this.selectedSize = data.assets[this.assetIndex].stockQuantity[0].size;
    this.outOfStock = (this.list.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;

    if (this.outOfStock) {
      let assetI = 0;
      this.list.assets.some((asset: any) => {
        let stockI = 0;
        let otherSizeAvailable = asset.stockQuantity.some((stockQ: any) => {
          if (stockQ.quantity > 0) {
            this.updateSizeIndex(stockI);
            return true;
          }
          stockI++;
          return false;
        });

        if (otherSizeAvailable) {
          return true;
        }

        assetI++;
        this.changeColor(assetI);
        return false;
      });

      const hehe = () => {

      }
    }

    this.selectedQ = this.getOrderQuantity()[0];
    this.fetchSimilarProducts = {
      'tags': this.list.info.tags
    };

    this.route.queryParams.subscribe(queryParam => {
      if (queryParam['color']) {
        this.assetIndex = queryParam['color'];
        this.changeColor(this.assetIndex);
      }
    });

    this.loading = false;
  }

  addToCart() {
    const cartItem = {
      sku: this.list.sku,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.selectedQ
    }

    this.outOfStock = (this.list.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;
    if (this.outOfStock) {
      this.toastService.errorToast({
        title: "This Product is out of stock"
      });
    }
    else {
      this.show = false;
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
    this.selectedColor = this.list?.assets[this.assetIndex].color;
    this.selectedSize = this.list?.assets[this.assetIndex].stockQuantity[this.sizeIndex].size;
    this.outOfStock = (this.list?.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity <= 0) ? true : false;

    if (!(this.getOrderQuantity().includes(this.selectedQ))) this.selectedQ = 0;
  }

  getOrderQuantity() {
    let limit = this.list?.assets[this.assetIndex].stockQuantity[this.sizeIndex].quantity;

    let arr = this.list?.info.orderQuantity;
    let filteredArray = arr.filter((item: any) => item <= limit);

    if (!(filteredArray.includes(limit)) && (arr[arr.length - 1] > limit)) {
      filteredArray.push(limit);
    }

    return filteredArray;
  }

  startRotatingTags(): void {
    if (this.list?.info?.tags) {
      const productTags = this.list?.info?.tags;

      setInterval(() => {
        const endIndex = this.currentIndex + this.tagsToShow;
        this.slicedTags = productTags.slice(this.currentIndex, endIndex);
        this.currentIndex = (this.currentIndex + this.tagsToShow) % productTags.length;

        // Trigger change detection
        this.changeDetector.detectChanges();
      }, 4000);
    }
  }

  createArrayToIterate(num: number) {
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

  handler(event: any) {
    this.show = event
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

}
