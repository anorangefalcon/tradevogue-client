import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CustomSelect } from 'src/app/shared/customSelect/custom-select';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';


@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent implements OnInit{

  productDetails: any = {};
  avgRating: number = 0;
  addReview: boolean = false;

  constructor(
    private elem_ref: ElementRef, 
    private route: ActivatedRoute,
    private fetchService: FetchDataService 
    ) {}

  ngOnInit() : void{
    this.productDetails.info = [];
    this.productDetails.reviews = [];
    
    const element = this.elem_ref.nativeElement.querySelectorAll('.customSelect');
    let select = new CustomSelect(element);

    this.route.params.subscribe(params => {
      const sku = params['sku'];

      this.fetchService.getData().subscribe((data: any[]) => {
        this.productDetails = data.find((item )=> {
          return item['sku'] === sku;
        });
        this.avgRating = 0;
        for(let i = 0; i < (this.productDetails.reviews).length; i++){
          this.avgRating += this.productDetails.reviews[i].rating;
        }
        this.avgRating = this.avgRating / this.productDetails.reviews.length;
      });
    });
    
  }

  customOptions: OwlOptions = {
    loop: true,
    
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    navSpeed: 600,
    navText: ['', ''],
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
    nav: false
  }
  customOptions1: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: true
  }

  createArrayToIterate(num: number){
    const newTotal = Math.floor(num);
    if (newTotal <= 0) {
      return [];
    }
    return Array(newTotal).fill(0);
  }

}
