import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SidecartService } from '../../services/sidecart.service';
@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {
  
  @Input() product: any = {};
  showPopup: boolean = false;


  constructor(private cartService: CartService, private sideCartService: SidecartService) { }

  avgRating: number = 0;
  offerPercentage: number = 0;
   selectedColor: string = "";

  ngOnInit(): void {

    this.avgRating = this.product.avgRating;
    
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

}
