import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent {

  bannerData : any;

  constructor (private bannerService: BannerService) {}

  ngOnInit(){    
    this.bannerService.getBanners().subscribe((data: any) => {
      console.log(data, "before filter in hero");
      
      this.bannerData = data.filter((banner: any)=> banner['active'] == true)
      console.log(this.bannerData, "banner data in hero page");
    })

  }
  getLink(link: string){
    return link.split('/')[1]
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
