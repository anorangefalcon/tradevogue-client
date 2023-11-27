import { Component, EventEmitter, Injectable, Injector, Output, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FetchDataService } from '../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';
import { HttpParams } from '@angular/common/http';
import { EyePopupService } from '../services/eye-popup.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-eye-popup',
  templateUrl: './eye-popup.component.html',
  styleUrls: ['./eye-popup.component.css'],
  // encapsulation: ViewEncapsulation.None 
})
export class EyePopupComponent {
  direction: any = 'popup';
  width:any='200px';
  show: boolean = false;
  fetchData = new BehaviorSubject<string>('');
  sku: any;
  list: any = [];
  avgRating: number = 0;
  productData: any = [];
  selectedColor: string = "";
  slicedTags: string[] = [];
  currentIndex = 0;
  tagsToShow = 3;
  private drawerSubscription!: Subscription;

  constructor(private eyePopService: EyePopupService,
    private toastService: ToastService,
    private router: Router,
    private cartService: CartService) {

     }

  ngOnInit() {
    this.avgRating = this.list.avgRating;
    this.eyePopService.EyePopupData.subscribe((data) => {
      if (!data) return;
      this.list = data;
      this.show = true;
    })
    this.startRotatingTags();
  }

  startRotatingTags(): void {
    if (this?.list && this.list?.info && this.list?.info?.tags) {
      const productTags = this?.list?.info?.tags;

      setInterval(() => {
        const endIndex = this.currentIndex + this.tagsToShow;
        this.slicedTags = productTags.slice(this.currentIndex, endIndex);
        this.currentIndex = (this.currentIndex + this.tagsToShow) % productTags.length;
      }, 5000); 
    }
  }

  // createArrayToIterate(num: number) {
  //   const newTotal = Math.floor(num);
  //   if (newTotal <= 0) {
  //     return [];
  //   }
  //   return Array(newTotal).fill(0);
  // }

  addToCart() {
    // console.log('product is ',this.product);
    // return;
    if (this.list.assets[0].stockQuantity[0].quantity <= 0) {
      this.toastService.errorToast({ title: 'Please select other variant of this product as it is outofStock' });
      this.router.navigate(['product/' + this.list.sku]);
      return;
    }
    const cartItem = {
      sku: this.list.sku,
      color: this.list.assets[0].color,
      size: this.list.assets[0].stockQuantity[0].size,
      quantity: this.list.info.orderQuantity[0]
    }

    this.cartService.addToCart(cartItem);
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
