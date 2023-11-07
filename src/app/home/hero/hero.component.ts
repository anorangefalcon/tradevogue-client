import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';


@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {

  bannerData : any;

  constructor (private bannerService: BannerService) {}

  ngOnInit(){
    console.log("home init");
    
    this.bannerService.getBanners().subscribe((data: any) => {
      this.bannerData = data;
      console.log(this.bannerData, "banner data");
    })

  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: false,
    navSpeed: 700,
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
}
