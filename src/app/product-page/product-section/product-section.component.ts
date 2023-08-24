import { Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CustomSelect } from 'src/app/shared/customSelect/custom-select';

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent implements OnInit {

  constructor(
    private elem_ref: ElementRef,
    private renderer: Renderer2
  ) { }

  @Input() data: any = {};
  currentCustomSelect: CustomSelect | undefined;
  showCarousel: boolean = false;

  ngOnInit(): void {
    console.log(this.data, "hehe data");


    setTimeout(() => {
      const element = this.elem_ref.nativeElement.querySelectorAll('.customSelect');

      if (this.currentCustomSelect) {
        this.currentCustomSelect.destroy();
      }

      this.currentCustomSelect = new CustomSelect(element);
    }, 0);
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


  createArrayToIterate(num: number) {
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

  showZoomedCarousel(image: any) {
    this.showCarousel = true;
    this.zoomCarouselOptions.startPosition = image;
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.showCarousel === true) {
      this.showCarousel = false;
    }
  }


  zoomCarouselOptions: OwlOptions = {
    loop: false,
    rewind: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    autoplay: false,
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
