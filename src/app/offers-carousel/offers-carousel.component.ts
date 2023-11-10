import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-offers-carousel',
  templateUrl: './offers-carousel.component.html',
  styleUrls: ['./offers-carousel.component.css']
})
export class OffersCarouselComponent {
  allOffers:any[]=[];
  constructor(private fetchdataService:FetchDataService,private BackendUrls:UtilsModule){
    this.fetchdataService.HTTPGET(this.BackendUrls.URLs.getOffers).subscribe((data:any) => {
      this.allOffers = data;
      console.log('ALLOFfer sis ',this.allOffers);
      
    });
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
